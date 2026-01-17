import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface BottomBarProps {
  discordInviteUrl: string;
}

export const BottomBar = ({ discordInviteUrl }: BottomBarProps) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center lg:bottom-8">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
      >
        <motion.a
          href={discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base lg:text-lg px-6 py-3 lg:px-8 rounded-xl shadow-2xl"
          >
            Join Us
          </Button>
        </motion.a>
      </motion.div>
    </div>
  );
};
