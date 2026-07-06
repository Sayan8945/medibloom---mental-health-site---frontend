import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAlt, FaPhone } from 'react-icons/fa';
import { FaEnvelope, FaGlobe } from 'react-icons/fa6';
import emailjs from '@emailjs/browser';

const FEATURES = [
  {
    icon: FaUserAlt,
    title: '24-Hour Service',
    desc: 'We are available round the clock to assist you with bookings, emergencies, or queries.',
  },
  {
    icon: FaEnvelope,
    title: 'Expert Therapists',
    desc: 'Our team consists of certified and highly experienced therapists to provide the best care.',
  },
  {
    icon: FaPhone,
    title: 'High Quality Care',
    desc: 'We ensure top-quality mental health services with personalized attention for every patient.',
  },
  {
    icon: FaGlobe,
    title: 'Trusted Clinic',
    desc: 'Our clinic is recognized and trusted by thousands of satisfied patients across the region.',
  },
];

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-800 placeholder-gray-400 transition-all duration-150 text-sm';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const templateParams = {
      form_email: form.email,
      form_phone: form.phone,
      form_adress: form.address,
      form_name: form.name,
      to_name: 'Sohan Ghosh',
      message: form.message,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: '', email: '', phone: '', address: '', message: '' });
      setShowModal(true);
    } catch (err) {
      console.error('Error sending email', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-heroBg py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 text-white">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold font-title mb-3">Make an Appointment</h2>
              <p className="text-white/60 leading-relaxed">
                Take the first step towards better mental health. Our team is here to support you
                every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-white/10 p-3 flex-shrink-0">
                    <Icon className="text-primary w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30"
          >
            <h3 className="text-2xl font-bold mb-6 text-heroBg">Book an Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="name"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Contact Number"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="tel"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="street-address"
                />
              </div>
              <textarea
                rows={4}
                name="message"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                required
              />
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.01 }}
                whileTap={{ scale: sending ? 1 : 0.98 }}
                className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-heroBg">Thank you!</h2>
              <p className="text-gray-600 mb-6">
                Thank you, <strong>{form.name || 'there'}</strong>! We've received your message
                and will get back to you soon.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
