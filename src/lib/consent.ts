/**
 * Cookie consent helpers.
 *
 * - Choice is stored in a first-party cookie (`sniper_consent`) for 180 days.
 * - Google (GA / GTM) is gated with Consent Mode: default is "denied" in
 *   index.html, and we flip analytics_storage on Accept.
 * - Microsoft Clarity is NOT in index.html any more. It is injected here,
 *   only after the visitor accepts.
 */

export type ConsentChoice = "accepted" | "declined";

const COOKIE_NAME = "sniper_consent";
const COOKIE_DAYS = 180;
const CLARITY_ID = "xpdi6m47bf";

/** Dispatch this event (or call openCookieSettings) to re-open the banner. */
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";

type AnyFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: AnyFn;
    clarity?: AnyFn & { q?: unknown[] };
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function getConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match?.[1];
  return value === "accepted" || value === "declined" ? value : null;
}

function saveConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${choice}; Max-Age=${COOKIE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
}

/** Expire first-party analytics cookies (GA + Clarity) when consent is declined/withdrawn. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const rootDomain = "." + host.split(".").slice(-2).join(".");
  const domains: (string | undefined)[] = [undefined, host, "." + host, rootDomain];

  document.cookie.split(";").forEach((raw) => {
    const name = raw.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
    });
  });
}

function loadClarity() {
  if (document.getElementById("clarity-script")) {
    window.clarity?.("consent", true);
    return;
  }
  // Same queue stub the official Clarity snippet creates.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stub: any = function () {
    // eslint-disable-next-line prefer-rest-params
    (stub.q = stub.q || []).push(arguments);
  };
  window.clarity = window.clarity || stub;

  const script = document.createElement("script");
  script.id = "clarity-script";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
}

/**
 * Apply a consent choice.
 * @param persist  false when replaying a choice already stored in the cookie
 */
export function applyConsent(choice: ConsentChoice, persist = true) {
  if (persist) saveConsent(choice);
  const granted = choice === "accepted";

  // Google Consent Mode (only analytics; ad_* stay denied)
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });

  if (granted) {
    loadClarity();
  } else {
    window.clarity?.("consent", false);
    clearAnalyticsCookies();
  }
}