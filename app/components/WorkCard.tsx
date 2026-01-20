import { motion } from "framer-motion";
import {
  FaXTwitter,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
} from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { SocialIconButton } from "~/components/ui/SocialIconButton";

/** ソーシャルリンクの設定 */
const SOCIAL_LINK_CONFIG = [
  { key: "twitter", Icon: FaXTwitter },
  { key: "instagram", Icon: FaInstagram },
  { key: "website", Icon: FiExternalLink },
  { key: "soundcloud", Icon: FaSoundcloud },
  { key: "spotify", Icon: FaSpotify },
] as const;

type SocialLinkKey = (typeof SOCIAL_LINK_CONFIG)[number]["key"];

interface WorkCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  tags?: string[];
  isNew?: boolean;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    soundcloud?: string;
    spotify?: string;
  };
  members?: {
    name: string;
    avatar: string;
  }[];
}

export const WorkCard = ({
  title,
  subtitle,
  image,
  link,
  tags = [],
  isNew = false,
  socialLinks,
  members = [],
}: WorkCardProps) => {
  const CardContent = (
    <motion.div
      className="bg-white rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* NEW Badge */}
      {isNew && (
        <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
          New
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Social Icons */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600">（{subtitle}）</p>
            )}
          </div>

          {/* Social Icons */}
          {socialLinks && (
            <div className="flex gap-2 ml-4">
              {SOCIAL_LINK_CONFIG.map(({ key, Icon }) => {
                const url = socialLinks[key as SocialLinkKey];
                if (!url) return null;
                return (
                  <SocialIconButton
                    key={key}
                    href={url}
                    icon={<Icon className="w-4 h-4" />}
                    onClick={(e) => e.stopPropagation()}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Members Avatar Group */}
        {members.length > 0 && (
          <div className="mt-auto pt-4">
            <div className="flex -space-x-2">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ zIndex: members.length - index }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200 transition-transform duration-200 group-hover:scale-110 group-hover:z-50">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {member.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
};
