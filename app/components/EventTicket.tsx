import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";

interface EventTicketProps {
  eventId: string;
  eventNumber: string;
  title: string;
  date: string;
  description?: string;
  isUpcoming: boolean;
  image?: string;
  color?: string;
  link?: string;
}

export function EventTicket({
  eventId,
  eventNumber,
  title,
  date,
  description,
  isUpcoming,
  image,
  color = "bg-blue-500",
  link,
}: EventTicketProps) {
  // カラーコード（#で始まる）かTailwindクラスか判定
  const isColorCode = color?.startsWith("#");

  const TicketContent = (
    <motion.div
      className="relative group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={isUpcoming ? { y: -8, rotate: 1, scale: 1.02 } : { opacity: 0.9 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main Ticket */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          !isColorCode && color
        )}
        style={isColorCode ? { backgroundColor: color } : undefined}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Event Info */}
          <div className="w-full lg:w-[30%] p-6 flex flex-col justify-between relative">
            {/* Perforated line */}
            <div className="absolute left-0 right-0 bottom-0 h-px border-b-2 border-dashed border-black/30 lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:w-px lg:h-auto lg:border-b-0 lg:border-r-2" />

            {/* Punch holes at perforation line */}
            {/* Mobile: horizontal at bottom, Desktop: vertical at right edge */}
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#eeeeee] rounded-full z-20 lg:top-0 lg:bottom-auto lg:left-auto lg:right-0 lg:translate-x-1/2 lg:-translate-y-1/2" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#eeeeee] rounded-full z-20 lg:top-auto lg:bottom-0 lg:left-auto lg:right-0 lg:translate-x-1/2 lg:translate-y-1/2" />

            <div className="pl-2">
              <div className="text-4xl lg:text-5xl font-black italic tracking-tighter scale-x-110 mb-4">{eventNumber}</div>
              <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter scale-x-110 mb-3 leading-tight">{title}</h3>
              <div className="text-xl lg:text-2xl font-bold opacity-90">{date}</div>
            </div>

            {description && (
              <div className="text-sm opacity-75 mt-4 pl-2">{description}</div>
            )}
          </div>

          {/* Right Side - Visual */}
          <div className="w-full lg:w-[70%] p-6 flex items-center justify-center relative">
            <div className="bg-white rounded-2xl w-full aspect-[18/9] flex items-center justify-center overflow-hidden relative">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="text-6xl font-black text-gray-900 mb-2">
                    {title.split(" ")[0]}
                  </div>
                  {description && (
                    <div className="text-sm text-gray-600">{description}</div>
                  )}
                </div>
              )}

              {/* Status badge */}
              {!isUpcoming && (
                <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold transform rotate-12">
                  USED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Torn edge effect for used tickets */}
        {!isUpcoming && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent pointer-events-none" />
        )}
      </div>
    </motion.div>
  );

  return (
    <Link
      to={`/events/${eventId}`}
      className="block cursor-pointer"
    >
      {TicketContent}
    </Link>
  );
}
