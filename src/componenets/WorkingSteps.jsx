import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '1',
    title: 'Fill a Form',
    description:
      "Start by answering a few quick questions about your mental health needs and preferences. This helps us understand the kind of support you're looking for.",
  },
  {
    number: '2',
    title: 'Get Matched',
    description:
      'Based on your inputs, our system connects you with the right resources — whether it\'s self-help tools, peer support, or a professional counselor.',
  },
  {
    number: '3',
    title: 'Get Scheduled',
    description:
      'Book and attend your session at a time that works best for you. Access continuous support through chat, resources, and wellness activities.',
  },
];

const WorkingSteps = () => (
  <section
    id="about"
    className="relative bg-cover bg-center py-24 bg-working-img overflow-hidden"
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-heroBg" style={{ opacity: 0.93 }} aria-hidden="true" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-white text-center mb-16"
      >
        <h2 className="text-4xl font-bold font-title mb-4">How We Work</h2>
        <p className="text-white/70 text-lg md:w-1/2 w-full mx-auto leading-relaxed">
          At MediBloom, we make mental wellness simple, private, and accessible for every student.
          Here's how it works:
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 md:w-4/5 mx-auto">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="relative bg-white text-center rounded-2xl p-8 flex-1 shadow-lg"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-primary/40">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-3 text-heroBg">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkingSteps;
