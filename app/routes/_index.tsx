import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { BottomBar } from "~/components/BottomBar";
import { EventTicket } from "~/components/EventTicket";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "~/components/ScrollAnimation";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { useState, useEffect, type ComponentType } from "react";
import {
  getEventsFromSheet,
  isEventUpcoming,
  type Event,
} from "~/utils/googleSheets.server";
import {
  DISCORD_INVITE_URL,
  MAIN_VISUAL_VIDEOS,
  VIDEO_EFFECTS,
  SITE_META,
  type VideoEffectType,
} from "~/constants";

/** Event型にisUpcomingフラグを追加した型 */
interface EventWithStatus extends Event {
  isUpcoming: boolean;
}

/** VideoEffectコンポーネントのProps型 */
interface VideoEffectProps {
  videoSrc: string;
  effectType: VideoEffectType;
}

export const meta: MetaFunction = () => {
  const { title, description, url, siteName, locale, themeColor } = SITE_META;
  const imageUrl = `${url}/actsrv-main-visual.png`;

  return [
    { title },
    { name: "description", content: description },

    // OGP Tags
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: locale },

    // Twitter Card Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },

    // Additional Meta Tags
    { name: "theme-color", content: themeColor },
  ];
};

export const loader = async () => {
  let eventsFromSheet: Event[];

  try {
    // Google Sheetsからデータを取得
    eventsFromSheet = await getEventsFromSheet();
  } catch (error) {
    console.warn("Failed to load from Google Sheets:", error);
    eventsFromSheet = [];
  }

  // Map events with isUpcoming flag and sort by date (newest first), then by number (highest first)
  const events = eventsFromSheet
    .map((event) => ({
      ...event,
      isUpcoming: isEventUpcoming(event),
    }))
    .sort((a, b) => {
      // まず日付で比較（新しい順）
      if (a.date && b.date) {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
      }
      // 日付が同じか無い場合は番号で比較（高い順）
      const numA = parseInt(a.number) || 0;
      const numB = parseInt(b.number) || 0;
      return numB - numA;
    });

  return { events };
};

interface MainContentProps {
  events: EventWithStatus[];
}

const MainContent = ({ events }: MainContentProps) => {
  return (
    <div className="w-full  lg:h-screen lg:overflow-y-auto">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Content with padding */}
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto pb-32">
        <EventSection events={events} />
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const [VideoEffectComponent, setVideoEffectComponent] =
    useState<ComponentType<VideoEffectProps> | null>(null);

  // ランダムに動画とエフェクトを選択
  const randomVideo =
    MAIN_VISUAL_VIDEOS[Math.floor(Math.random() * MAIN_VISUAL_VIDEOS.length)];
  const randomEffect =
    VIDEO_EFFECTS[Math.floor(Math.random() * VIDEO_EFFECTS.length)];

  // クライアントサイドでのみVideoEffectをロード
  useEffect(() => {
    import("~/components/VideoEffect.client").then((module) => {
      setVideoEffectComponent(() => module.VideoEffect);
    });
  }, []);

  return (
    <ScrollAnimation variant="scale" duration={1.4}>
      <motion.a
        href={DISCORD_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full cursor-pointer overflow-hidden relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
      >
        {VideoEffectComponent ? (
          <VideoEffectComponent videoSrc={randomVideo} effectType={randomEffect} />
        ) : (
          <video
            src={randomVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        )}

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-6xl md:text-[12rem] lg:text-[16rem] font-black text-white tracking-tighter">
            ACTVSRV
          </h1>
        </div>
      </motion.a>
    </ScrollAnimation>
  );
};

export const EventSection = ({ events }: { events: EventWithStatus[] }) => {
  return (
    <section className="mb-16">
      <ScrollAnimation variant="slideUp" duration={1.4} delay={0.3}>
        <SectionHeading text="EVENTS" colorClass="text-orange-500" />
      </ScrollAnimation>

      <StaggerContainer staggerDelay={0.4} className="space-y-8">
        {events.map((event) => (
          <StaggerItem key={event.id}>
            <EventTicket
              eventId={event.id}
              eventNumber={event.number}
              title={event.title}
              date={event.date}
              description={event.description}
              isUpcoming={event.isUpcoming}
              color={event.color}
              image={event.image}
              link={event.link}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default function Index() {
  const { events } = useLoaderData<typeof loader>();

  return (
    <div className="w-full min-h-screen bg-[#eeeeee]">
      {/* Right Side - Content */}
      <Header />
      <MainContent events={events} />
      <BottomBar discordInviteUrl={DISCORD_INVITE_URL} />
    </div>
  );
}
