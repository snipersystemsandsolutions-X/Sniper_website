import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

const CONTACT = { label: "Contact us", to: "/contact" };
const CATALOGUE = { label: "Get catalogue", href: "/catalogue" };

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white";

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5c-4.7 0-8.5 3.4-8.5 7.6 0 2 .9 3.8 2.3 5.1L5 20.5l4-1.6c.9.2 1.9.4 3 .4 4.7 0 8.5-3.4 8.5-7.6S16.7 3.5 12 3.5Z" />
    <path d="M8.5 11.3h.01M12 11.3h.01M15.5 11.3h.01" strokeWidth="2.4" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5" />
    <path d="M4 15.5v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const ContactDock = () => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* ≥ lg: vertical tabs on the right edge */}
      <nav
        aria-label="Quick contact"
        className="fixed right-0 top-[22vh] z-[35] hidden flex-col items-end gap-3 lg:flex"
        style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        <Link
          to={CONTACT.to}
          className={`flex h-[168px] w-11 items-center justify-center rounded-l-[16px] bg-[#DC3327] text-white shadow-[-6px_8px_20px_-10px_rgba(0,0,0,0.45)] transition-[width] duration-200 hover:w-[52px] focus-visible:w-[52px] ${FOCUS}`}
        >
          <span className="text-[12px] font-medium uppercase tracking-[0.06em] [writing-mode:vertical-rl] rotate-180">
            {CONTACT.label}
          </span>
        </Link>

        <a
          href={CATALOGUE.href}
          className="flex h-[168px] w-11 items-center justify-center rounded-l-[16px] border border-r-0 border-[#DC3327] bg-[#F5F5F7] text-[#DC3327] transition-[width,background-color,color] duration-200 hover:w-[52px] hover:bg-[#DC3327] hover:text-white focus-visible:w-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#DC3327]"
        >
          <span className="text-[12px] font-medium uppercase tracking-[0.06em] [writing-mode:vertical-rl] rotate-180">
            {CATALOGUE.label}
          </span>
        </a>
      </nav>

      {/* < lg: bottom bar */}
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-[35] bg-[#DC3327] pb-[env(safe-area-inset-bottom)] text-white lg:hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        <ul className="grid grid-cols-2 divide-x divide-white/35">
          <li>
            <Link to={CONTACT.to} className={`flex h-14 items-center justify-center gap-3 text-[15px] font-medium active:bg-black/10 ${FOCUS}`}>
              <ChatIcon />
              {CONTACT.label}
            </Link>
          </li>
          <li>
            <a href={CATALOGUE.href} className={`flex h-14 items-center justify-center gap-3 text-[15px] font-medium active:bg-black/10 ${FOCUS}`}>
              <DownloadIcon />
              {CATALOGUE.label}
            </a>
          </li>
        </ul>
      </nav>
    </>,
    document.body
  );
};

export default ContactDock;