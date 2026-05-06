import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Product',
    links: ['Ride', 'Drive', 'Business', 'Cities'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Safety', 'Contact Us', 'Accessibility'],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-white/[0.06] pt-16 pb-8">
      <div className="container-rf">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <Link to="/" className="font-display text-xl text-warm-white">
              Ride<span className="text-amber-600">Flow</span>
            </Link>
            <p className="mt-3 text-sm text-warm-muted leading-relaxed max-w-[220px]">
              Premium ride-hailing for discerning travelers. Warm service, every ride.
            </p>
          </div>

          {/* Link columns */}
          {columns.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-warm-muted hover:text-amber-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/[0.06] gap-4">
          <p className="text-xs text-warm-faint">
            © 2025 RideFlow Inc. All rights reserved.{' '}
            <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
            {' · '}
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
            {' · '}
            <a href="#" className="hover:text-amber-400 transition-colors">Cookies</a>
          </p>

          <div className="flex items-center gap-4">
            {[
              { icon: <Twitter size={18} />, label: 'Twitter' },
              { icon: <Instagram size={18} />, label: 'Instagram' },
              { icon: <Linkedin size={18} />, label: 'LinkedIn' },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-warm-muted hover:text-amber-400 hover:border-amber-600/40 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
