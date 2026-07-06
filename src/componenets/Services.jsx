import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import serviceImg1 from '../assets/service1.png';
import serviceImg2 from '../assets/service2.png';
import serviceImg3 from '../assets/service3.png';
import serviceImg4 from '../assets/service4.png';

const SERVICE_DATA = [
  {
    title: 'Couple Counseling',
    image: serviceImg1,
    description:
      'Offers a safe space for partners to talk openly, improve understanding, and strengthen their bond. It helps in resolving conflicts, enhancing communication, and building a healthier, happier relationship together.',
    benefits: [
      'Improves communication and understanding between partners',
      'Helps resolve conflicts in a healthy way',
      'Strengthens emotional connection and trust',
    ],
  },
  {
    title: "Can't Focus",
    image: serviceImg2,
    description:
      "Struggling to concentrate can feel frustrating and exhausting. Counseling can help uncover what's affecting your focus and guide you with tools to improve attention and mental clarity.",
    benefits: [
      'Identifies underlying causes of distraction',
      'Teaches strategies to improve concentration',
      'Reduces stress and boosts productivity',
    ],
  },
  {
    title: 'Feeling Stuck',
    image: serviceImg3,
    description:
      'At times, life may feel overwhelming or directionless, leaving you unsure of the next step. Counseling can help you gain clarity, build confidence, and move forward with purpose.',
    benefits: [
      'Provides clarity and fresh perspective',
      'Helps set realistic goals and direction',
      'Builds motivation and confidence to take action',
    ],
  },
  {
    title: 'Self-Destructive Patterns',
    image: serviceImg4,
    description:
      'Sometimes we may fall into habits or thoughts that hurt us, even without realizing it. Counseling offers support to break these cycles, understand the root causes, and find healthier ways to cope.',
    benefits: [
      'Identifies negative patterns and their triggers',
      'Encourages healthier coping strategies',
      'Builds self-worth and a more positive outlook',
    ],
  },
];

// ── Single service card (used in both mobile carousel and desktop panel) ──
const ServiceCard = ({ service }) => (
  <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm overflow-hidden">
    <img
      src={service.image}
      alt={service.title}
      className="w-full h-44 sm:h-56 object-cover flex-shrink-0"
      loading="lazy"
    />
    <div className="p-5 sm:p-6 flex flex-col flex-1 font-secondary">
      <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{service.description}</p>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h4>
        <ul className="space-y-2">
          {service.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
              <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ── Desktop panel (image right, text left) ──
const DesktopPanel = ({ service }) => (
  <motion.div
    key={service.title}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="flex flex-col md:flex-row gap-8 mt-8"
  >
    <div className="md:w-1/2 bg-white rounded-2xl p-8 lg:p-10 font-secondary shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-primary mb-4">{service.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
      </div>
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-3">Benefits</h4>
        <ul className="space-y-3">
          {service.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary block" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="md:w-1/2">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-56 sm:h-72 md:h-full min-h-[320px] max-h-[420px] rounded-2xl object-cover shadow-md"
        loading="lazy"
      />
    </div>
  </motion.div>
);

const Services = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="bg-[#f7f8fc] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-title text-heroBg mb-4">
            What Can We Do Together
          </h2>
          <p className="sm:w-4/5 md:w-1/2 mx-auto text-gray-600 leading-relaxed text-sm sm:text-base">
            Life brings challenges, but you don't have to face them alone. Together, we can work on
            strengthening relationships, improving communication, building resilience, and finding
            peace within.
          </p>
        </motion.div>

        {/* ── Mobile: horizontal scroll carousel ── */}
        <div className="md:hidden">
          {/* Scroll hint label */}
          <p className="text-xs text-gray-400 text-center mb-3 flex items-center justify-center gap-1">
            <span>←</span> Swipe to explore <span>→</span>
          </p>
          <div
            className="-mx-4 px-4 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {SERVICE_DATA.map((service) => (
              <div
                key={service.title}
                className="snap-start flex-shrink-0 w-[82vw] max-w-[320px]"
              >
                <ServiceCard service={service} />
              </div>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {SERVICE_DATA.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>

        {/* ── Desktop: tab list + panel ── */}
        <div className="hidden md:block">
          {/* Tab list */}
          <div className="flex gap-1 border-b-2 border-gray-200 mb-0 overflow-x-auto">
            {SERVICE_DATA.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active === i
                    ? 'text-primary bg-white border-b-2 border-primary -mb-0.5'
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <DesktopPanel key={active} service={SERVICE_DATA[active]} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Services;
