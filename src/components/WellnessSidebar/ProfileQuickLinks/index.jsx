import { motion } from 'framer-motion';
import {
  MdPerson, MdHistory, MdOutlineMood, MdMenuBook,
  MdSettings, MdHelpOutline,
} from 'react-icons/md';
import { IoChevronForward, IoLogOutOutline, IoCalendarOutline } from 'react-icons/io5';

/**
 * Quick-access account navigation — routes to existing pages only
 * (no new routes introduced). Items without a real destination yet
 * (Appointments, Journal Entries) are marked "Soon" and are inert, so we
 * never claim functionality the app doesn't have.
 */
const LINKS = [
  { id: 'profile',       icon: MdPerson,          label: 'My Profile',         action: 'profile' },
  { id: 'history',       icon: MdHistory,         label: 'Assessment History', to: '/history' },
  { id: 'appointments',  icon: IoCalendarOutline, label: 'Appointments',       action: 'contact' },
  { id: 'mood-history',  icon: MdOutlineMood,     label: 'Mood History',       to: '/mood' },
  { id: 'journal',       icon: MdMenuBook,        label: 'Journal Entries',    disabled: true },
  { id: 'settings',      icon: MdSettings,        label: 'Settings',           action: 'settings' },
  { id: 'help',          icon: MdHelpOutline,     label: 'Help & Support',     action: 'contact' },
];

const LinkItem = ({ item, index, onNavigate, onAction }) => {
  const Icon = item.icon;
  const disabled = !!item.disabled;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
      whileHover={disabled ? {} : { x: 3 }}
      onClick={() => {
        if (disabled) return;
        if (item.to) onNavigate(item.to);
        else if (item.action) onAction(item.action);
      }}
      disabled={disabled}
      aria-disabled={disabled}
      className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-white/8 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
      }`}
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
        <Icon className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
      </span>
      <span className="flex-1 text-sm text-white/70 group-hover:text-white transition-colors font-medium">
        {item.label}
      </span>
      {disabled ? (
        <span className="text-[10px] text-white/30 font-medium">Soon</span>
      ) : (
        <motion.span
          className="text-white/30 group-hover:text-primary transition-colors"
          initial={false}
          whileHover={{ x: 2 }}
        >
          <IoChevronForward className="w-3.5 h-3.5" />
        </motion.span>
      )}
    </motion.button>
  );
};

/**
 * @param {(path: string) => void} onNavigate - react-router navigate
 * @param {(action: 'profile'|'settings'|'contact') => void} onAction - opens
 *   a modal or scrolls to a homepage section instead of routing
 * @param {() => void} onLogout
 */
const ProfileQuickLinks = ({ onNavigate, onAction, onLogout }) => (
  <div className="space-y-0.5">
    {LINKS.map((item, i) => (
      <LinkItem key={item.id} item={item} index={i} onNavigate={onNavigate} onAction={onAction} />
    ))}

    <div className="pt-1 mt-1 border-t border-white/10">
      <motion.button
        type="button"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: LINKS.length * 0.03, ease: 'easeOut' }}
        whileHover={{ x: 3 }}
        onClick={onLogout}
        className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors hover:bg-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-400 focus:outline-none"
      >
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 group-hover:bg-rose-500/15 flex items-center justify-center transition-colors">
          <IoLogOutOutline className="w-4 h-4 text-white/60 group-hover:text-rose-400 transition-colors" />
        </span>
        <span className="flex-1 text-sm text-white/70 group-hover:text-rose-300 transition-colors font-medium">
          Logout
        </span>
      </motion.button>
    </div>
  </div>
);

export default ProfileQuickLinks;
