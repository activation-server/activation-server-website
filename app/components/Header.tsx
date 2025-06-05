import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messages = useMemo(() => {
    return ["We are activaters"];
  }, []);

  return (
    <header className="sticky top-0">
      <div className="bg-neutral-800 text-white text-center p-2 text-sm">
        <div className="relative h-12 flex items-center">
          <div className="animate-scroll-left whitespace-nowrap flex">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                className="inline-block px-8 text-sm font-medium"
                key={index}
              >
                {messages[0] || "Welcome to Activation Server!"}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border-b">
        <img
          src="/icon-horizontal.png"
          alt="Activation Server Logo"
          className="h-8"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
    </header>
  );
};
