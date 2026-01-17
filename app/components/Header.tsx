import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between p-4">
        <motion.img
          src="/icon/icon-horizontal.png"
          alt="Activation Server Logo"
          className="h-14"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="default"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3"
          >
            {isMenuOpen ? <X size={48} /> : <Menu size={48} />}
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
};
