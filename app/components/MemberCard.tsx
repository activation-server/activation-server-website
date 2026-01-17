import { motion } from "framer-motion";

interface MemberCardProps {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export const MemberCard = ({
  name,
  avatar,
  role,
}: MemberCardProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Role */}
      <h3 className="text-sm md:text-base font-bold text-black">
        {name}
      </h3>
      <p className="text-xs text-gray-600">{role}</p>
    </motion.div>
  );
};
