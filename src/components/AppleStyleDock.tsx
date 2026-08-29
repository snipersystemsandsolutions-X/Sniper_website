'use client';

import { useLocation, Link } from 'react-router-dom';
import { Briefcase, Handshake, Info } from 'lucide-react';

const navigationData = [
  { title: 'Solutions', icon: Briefcase, href: '/solutions' },
  { title: 'Partners', icon: Handshake, href: '/partners' },
  { title: 'Industries', icon: Info, href: '/industries' },
];

// Subtle grain texture
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

export function AppleStyleDock() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4"
      aria-label="Primary"
    >
      <div
        className="
          flex
          items-end
          gap-0.5
          rounded-full
          px-1.5
          py-1.5
          border
          border-white/10
        "
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: GRAIN_BG,
        }}
      >
        {navigationData.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className="group relative flex flex-col items-center"
            >
              {/* Label — visible on hover only */}
              <span
                className="
                  pointer-events-none
                  absolute
                  -top-8
                  whitespace-nowrap
                  rounded-full
                  bg-neutral-900/95
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  tracking-wide
                  text-white
                  antialiased
                  shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                  border
                  border-white/10
                  opacity-0
                  translate-y-1
                  scale-95
                  transition-all
                  duration-200
                  ease-out
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  group-hover:scale-100
                "
                style={{ fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }}
              >
                {item.title}
              </span>

              <div
                className={`
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-colors
                  duration-150
                  ${isActive
                    ? 'bg-white'
                    : 'bg-transparent group-hover:bg-white/10'
                  }
                `}
              >
                <Icon
                  strokeWidth={1.75}
                  className={`
                    h-5
                    w-5
                    transition-colors
                    duration-150
                    ${isActive
                      ? 'text-black'
                      : 'text-neutral-400 group-hover:text-white'
                    }
                  `}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
