import { motion } from 'framer-motion';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'resources', label: 'Resources' },
  { id: 'about', label: 'About' },
  { id: 'testimonial', label: 'Inspiration' },
  { id: 'contact', label: 'Contact' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
};

const Footer = () => (
  <footer className="bg-heroBg border-t border-white/10 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-5 sm:gap-8 mb-5 sm:mb-10">
        {/* Brand */}
        <div className="space-y-3 max-w-xs">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MediBloom" className="h-8 w-auto" />
            <span className="font-apple text-primary font-bold text-lg pt-2">MediBloom</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Making mental wellness simple, private, and accessible for every student.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
            Navigation
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-150"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} MediBloom. All rights reserved.
        </p>
        <p className="text-white/30 text-xs">Built with care for student wellbeing.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
