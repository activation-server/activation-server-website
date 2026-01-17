import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface BottomBarProps {
  discordInviteUrl: string;
}

export const BottomBar = ({ discordInviteUrl }: BottomBarProps) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center lg:bottom-8">
      <motion.div
        className="bg-white/70 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-2xl border border-white/20"
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
            className="shadow-none bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl lg:text-2xl px-8 py-4 lg:px-12 lg:py-5 rounded-xl"
          >
            Join Us
          </Button>
        </motion.a>
      </motion.div>
    </div>
  );
};
