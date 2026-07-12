import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { FaCircleArrowRight } from 'react-icons/fa6';

import thumbImg1 from '../assets/video-thumbnail1.jpg';
import thumbImg2 from '../assets/video-thumbnail2.jpg';
import thumbImg3 from '../assets/video-thumbnail3.jpg';
import thumbImg4 from '../assets/video-thumbnail4.jpg';

const VIDEO_DATA = [
  {
    thumbnail: thumbImg1,
    embedUrl: 'https://www.youtube.com/embed/5JCLyjw8Wtk?si=dDEraPPKBI3he1bG',
    channelUrl: 'https://www.youtube.com/@NavigatingLifeWithArghya',
    title: 'Defeat Depression and Live Your Best Life',
    description:
      "Arghya Chakraborty, an assistant professor, shares powerful insights on overcoming depression and building a fulfilling life.",
  },
  {
    thumbnail: thumbImg2,
    embedUrl: 'https://www.youtube.com/embed/aSWLkMU7Ml4',
    channelUrl: 'https://www.youtube.com/@BuddhismInEnglish',
    title: 'How to Stay Focused in Studies',
    description:
      'Mahamevnawa Bodhignana Monastery shares timeless Buddhist teachings on cultivating focus and clarity of mind.',
  },
  {
    thumbnail: thumbImg3,
    embedUrl: 'https://www.youtube.com/embed/DulNz2CkoHI?si=PZ5rQj-OAxb0PtSK',
    channelUrl: 'https://www.youtube.com/@gurudev',
    title: 'Short Guided Meditation for Relaxation',
    description:
      'Gurudev Sri Sri Ravi Shankar, humanitarian and spiritual leader, guides you through a calming meditation session.',
  },
  {
    thumbnail: thumbImg4,
    embedUrl: 'https://www.youtube.com/embed/sfSDQRdIvTc?si=w1AZOaG3-PQ-3OI7',
    channelUrl: 'https://www.youtube.com/@satvicyoga',
    title: '10-Min Meditation to Quiet Your Thoughts',
    description:
      'Practice this every day, early morning and before sleep, for the best experience and lasting inner peace.',
  },
];

const VideoCard = ({ video, onPlay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-6 flex flex-col items-center"
  >
    {/* Thumbnail */}
    <div className="w-full relative mb-3 sm:mb-6 rounded-xl overflow-hidden">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-44 sm:h-56 object-cover"
        loading="lazy"
      />
      <button
        onClick={() => onPlay(video.embedUrl)}
        aria-label={`Play: ${video.title}`}
        className="absolute inset-0 flex items-center justify-center group"
      >
        <span className="bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-transform duration-200 p-2.5 sm:p-4 rounded-full shadow-lg shadow-primary/40">
          <IoPlay className="w-4 h-4 sm:w-6 sm:h-6 text-white translate-x-0.5" />
        </span>
      </button>
    </div>

    <h3 className="text-sm sm:text-lg font-title font-bold mb-1.5 sm:mb-3 text-center text-heroBg leading-snug">
      {video.title}
    </h3>
    <p className="hidden sm:block text-sm text-gray-500 mb-6 text-center leading-relaxed flex-1">
      {video.description}
    </p>

    <motion.a
      href={video.channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-1.5 sm:py-2 px-4 sm:px-5 font-medium rounded-xl text-xs sm:text-sm transition-colors duration-150"
    >
      Visit Channel
      <FaCircleArrowRight />
    </motion.a>
  </motion.div>
);

const Resources = () => {
  const [activeVideo, setActiveVideo] = useState('');

  return (
    <section id="resources" className="bg-[#f7f8fc] py-10 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold font-title text-heroBg mb-2 sm:mb-4">Wellness Resources</h2>
          <p className="md:w-1/2 mx-auto text-gray-600 leading-relaxed text-xs sm:text-base">
            Carefully selected videos to support your mental health journey — from guided meditations
            to expert talks on focus, resilience, and emotional wellbeing.
          </p>
        </motion.div>

        {/* ── Mobile: horizontal scroll carousel  |  sm+: 2-col grid ── */}

        {/* Mobile carousel */}
        <div className="sm:hidden -mx-4 px-4">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {VIDEO_DATA.map((video) => (
              <div
                key={video.embedUrl}
                className="snap-start flex-shrink-0 w-[82vw] max-w-[320px]"
              >
                <VideoCard video={video} onPlay={setActiveVideo} />
              </div>
            ))}
            {/* trailing spacer so last card doesn't hug edge */}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
          {/* Scroll hint dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {VIDEO_DATA.map((v, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-6">
          {VIDEO_DATA.map((video) => (
            <VideoCard key={video.embedUrl} video={video} onPlay={setActiveVideo} />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setActiveVideo('')}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full rounded-2xl shadow-2xl"
                src={activeVideo}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <button
                onClick={() => setActiveVideo('')}
                aria-label="Close video"
                className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2 shadow-lg transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Resources;
