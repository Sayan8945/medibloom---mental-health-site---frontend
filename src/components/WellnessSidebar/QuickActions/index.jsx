import { motion } from 'framer-motion';
import { MdBolt, MdOutlineMood } from 'react-icons/md';
import { IoSparkles, IoCalendarOutline } from 'react-icons/io5';

const ACTIONS = [
  { id: 'assessment', icon: MdBolt,           label: 'Take Assessment',      action: 'assessment' },
  { id: 'checkin',    icon: MdOutlineMood,    label: 'Daily Check-in',       action: 'checkin' },
  { id: 'chat',       icon: IoSparkles,       label: 'Talk to AI Assistant', action: 'chat' },
  { id: 'appointment',icon: IoCalendarOutline,label: 'Book Appointment',     action: 'appointment' },
];

const ActionButton = ({ item, index, onAction }) => {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onAction(item.action)}
      className="flex items-center gap-2.5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/30 rounded-xl px-3.5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      <span className="text-xs font-semibold text-white/80 leading-tight">{item.label}</span>
    </motion.button>
  );
};

/**
 * @param {(action: 'assessment'|'checkin'|'chat'|'appointment') => void} onAction
 */
const QuickActions = ({ onAction }) => (
  <div className="grid grid-cols-2 gap-2">
    {ACTIONS.map((item, i) => (
      <ActionButton key={item.id} item={item} index={i} onAction={onAction} />
    ))}
  </div>
);

export default QuickActions;
