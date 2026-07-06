import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { quotes } from '../data/quotes';

// Pick 4 random quotes without mutating the original array
const getRandomQuotes = (arr, count = 4) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const QuoteCard = ({ quote, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <BsFillChatQuoteFill className="w-8 h-8 text-primary/30 mb-3 flex-shrink-0" />

    <p className="font-apple text-sm md:text-base leading-relaxed mb-6 text-gray-800">
      {quote.Quote}
    </p>

    <div className="flex items-center gap-3 mt-auto">
      <img
        src={quote.image}
        alt={quote.name}
        className="w-14 h-14 rounded-full object-cover shadow-sm flex-shrink-0"
        loading="lazy"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900">{quote.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{quote.identity}</p>
      </div>
    </div>
  </motion.div>
);

const Quotes = () => {
  const selectedQuotes = useMemo(() => getRandomQuotes(quotes, 4), []);

  return (
    <section id="testimonial" className="bg-[#f7f8fc] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-title mb-4">
            Fuel Your Mind with Gentle Wisdom
          </h2>
          <p className="text-gray-600 text-base md:text-lg md:w-1/2 mx-auto leading-relaxed">
            Timeless words from great leaders and visionaries to bring you clarity, peace, and
            encouragement. A quiet reminder that growth begins within.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {selectedQuotes.map((quote, index) => (
            <QuoteCard key={`${quote.name}-${index}`} quote={quote} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quotes;
