import type { ReactNode, MouseEvent } from "react";

interface SocialIconButtonProps {
  href: string;
  icon: ReactNode;
  onClick?: (e: MouseEvent) => void;
}

/**
 * ソーシャルリンク用の丸いアイコンボタン
 */
export const SocialIconButton = ({
  href,
  icon,
  onClick,
}: SocialIconButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
      onClick={onClick}
    >
      {icon}
    </a>
  );
};
