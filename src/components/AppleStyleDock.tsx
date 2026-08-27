'use client';

import { useLocation, Link } from 'react-router-dom';
import { Home, Info, Briefcase, Handshake, Mail } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock';

const navigationData = [
  { title: 'Home', icon: Home, href: '/' },
  { title: 'About Us', icon: Info, href: '/about' },
  { title: 'Solutions', icon: Briefcase, href: '/solutions' },
  { title: 'Partners', icon: Handshake, href: '/partners' },
  { title: 'Contact', icon: Mail, href: '/contact' },
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
              className="relative flex flex-col items-center"
            >
              <div
                className={`
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${isActive
                    ? 'bg-white'
                    : 'bg-transparent'
                  }
                `}
              >
                <Icon
                  strokeWidth={1.75}
                  className={`
                    h-5
                    w-5
                    ${isActive
                      ? 'text-black'
                      : 'text-neutral-400'
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