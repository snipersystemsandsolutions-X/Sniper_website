import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  applyConsent,
  getConsent,
  OPEN_SETTINGS_EVENT,
  type ConsentChoice,
} from "@/lib/consent";

/**
 * Cookie consent banner.
 * Renders nothing on the server / during react-snap prerender and on first
 * client render (state starts closed), so hydration never mismatches.
 */
export const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = getConsent();
    if (saved) {
      applyConsent(saved, false); // replay stored choice (loads Clarity if accepted)
    } else {
      setOpen(true);
    }

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    applyConsent(choice);
    setOpen(false);
  };

  // Same size and weight for both buttons on purpose (EU regulators expect
  // "decline" to be as easy as "accept").
  const btn =
    "flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-labelledby="cookie-consent-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
          className="fixed inset-x-4 bottom-4 z-[100] rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:right-auto sm:max-w-md"
        >
          <h2 id="cookie-consent-title" className="text-base font-bold text-neutral-900">
            Your privacy choices
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            We use cookies for analytics and session recordings (Google Analytics and
            Microsoft Clarity) to understand how visitors use our site. Nothing is
            collected until you accept. See our{" "}
            <Link to="/privacy" className="font-medium text-neutral-900 underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => choose("declined")}
              className={`${btn} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100`}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className={`${btn} border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700`}
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;