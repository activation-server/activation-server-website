import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/Header";
import { BottomBar } from "~/components/BottomBar";
import { EventTicket } from "~/components/EventTicket";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "~/components/ScrollAnimation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const meta: MetaFunction = () => {
  const title = "活性化サーバー | Activation Server";
  const description =
    "活性化サー�ーは、活性化を目的としたサーバーです。様々な活動やイベントが行われます。";
  const url = "https://activation-server.com"; // 実際のURLに変更してください
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
    { property: "og:site_name", content: "Activation Server" },
    { property: "og:locale", content: "ja_JP" },

    // Twitter Card Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },

    // Additional Meta Tags
    { name: "theme-color", content: "#000000" },
  ];
};

export const loader = async () => {
  return null;
};

const MainContent = () => {
  return (
    <div className="w-full  lg:h-screen lg:overflow-y-auto">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Content with padding */}
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto pb-32">
        <EventSection />
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const [VideoEffect, setVideoEffect] = useState<any>(null);
  const discordInviteUrl =
    "https://discord.com/invite/BwtTvC8Fny?fbclid=PAZXh0bgNhZW0CMTEAAac1PFb-eN8Jh94RDx-Ej9NW2sYksBPX4LMdPLokE9mQfwvoWMe-girvS9dZww_aem_dcecfxWLJvu-LJkts3CUEw";

  // ランダムに動画を選択
  const videos = [
    "/main-visual/main-visual-1.mov",
    "/main-visual/main-visual-2.mov",
    "/main-visual/main-visual-3.mov",
    "/main-visual/main-visual-4.mov",
    "/main-visual/main-visual-5.mov",
  ];
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  // ランダムにエフェクトを選択
  const effects = ["glitch", "ascii", "pixelate", "vhs"] as const;
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];

  // クライアントサイドでのみVideoEffectをロード
  useEffect(() => {
    import("~/components/VideoEffect.client").then((module) => {
      setVideoEffect(() => module.VideoEffect);
    });
  }, []);

  return (
    <ScrollAnimation variant="scale" duration={1.4}>
      <motion.a
        href={discordInviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full cursor-pointer overflow-hidden relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
      >
        {VideoEffect ? (
          <VideoEffect videoSrc={randomVideo} effectType={randomEffect} />
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

export const EventSection = () => {
  return (
    <section className="mb-8">
      <ScrollAnimation variant="slideUp" duration={1.4} delay={0.3}>
        <div className="relative mb-6">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black italic text-orange-500 tracking-tighter scale-x-110">
            EVENTS
          </h2>
          <h2
            className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-orange-500/20 translate-y-2 translate-x-2 -z-10 tracking-tighter scale-x-110"
            aria-hidden="true"
          >
            EVENTS
          </h2>
          <h2
            className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-orange-500/10 translate-y-4 translate-x-4 -z-20 tracking-tighter scale-x-110"
            aria-hidden="true"
          >
            EVENTS
          </h2>
        </div>
      </ScrollAnimation>

      <StaggerContainer staggerDelay={0.4} className="space-y-8">
        {/* Upcoming Event */}
        <StaggerItem>
          <EventTicket
            eventNumber="NO.02"
            title="P.E"
            date="2026.02.28"
            description="音楽の身体性を育むイベント"
            isUpcoming={true}
            color="bg-blue-500"
            image="PE/PE_KV.png"
          />
        </StaggerItem>

        {/* Past Event */}
        <StaggerItem>
          <EventTicket
            eventNumber="NO.01"
            title="Gotz Green"
            date="2025.07.20"
            description="目指せ文化の三冠王"
            isUpcoming={false}
            color="bg-green-600"
            image="/gotzgreen/18.png"
          />
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
};

const DISCORD_INVITE_URL =
  "https://discord.com/invite/BwtTvC8Fny?fbclid=PAZXh0bgNhZW0CMTEAAac1PFb-eN8Jh94RDx-Ej9NW2sYksBPX4LMdPLokE9mQfwvoWMe-girvS9dZww_aem_dcecfxWLJvu-LJkts3CUEw";

export default function Index() {
  return (
    <div className="w-full min-h-screen bg-[#eeeeee]">
      {/* Right Side - Content */}
      <Header />
      <MainContent />
      <BottomBar discordInviteUrl={DISCORD_INVITE_URL} />
    </div>
  );
}
