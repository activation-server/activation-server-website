import { motion } from "framer-motion";

interface MemberCardProps {
  name: string;
  avatar: string;
  role: string;
}

export const MemberCard = ({ name, avatar, role }: MemberCardProps) => {
  return (
    <motion.div
      className="flex-shrink-0 bg-white rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 min-w-[200px]"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Role */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-black truncate">
          {name}
        </h3>
        <p className="text-xs text-gray-600 truncate">{role}</p>
      </div>
    </motion.div>
  );
};
