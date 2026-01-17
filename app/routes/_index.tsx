import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { BottomBar } from "~/components/BottomBar";
import { EventTicket } from "~/components/EventTicket";
import { WorkCard } from "~/components/WorkCard";
import { MemberCard } from "~/components/MemberCard";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "~/components/ScrollAnimation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import membersData from "~/data/members.json";
import worksData from "~/data/works.json";

export const meta: MetaFunction = () => {
  const title = "活性化サーバー | Activation Server";
  const description =
    "活性化サーバーは、活性化を目的としたサーバーです。様々な活動やイベントが行われます。";
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
  // Map works with member details
  const works = worksData.map((work) => ({
    ...work,
    members: work.memberIds.map((memberId) => {
      const member = membersData.find((m) => m.id === memberId);
      return member
        ? { name: member.name, avatar: member.avatar }
        : { name: "Unknown", avatar: "" };
    }),
  }));

  return { works, members: membersData };
};

const MainContent = ({ works, members }: { works: any[]; members: any[] }) => {
  return (
    <div className="w-full  lg:h-screen lg:overflow-y-auto">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Content with padding */}
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto pb-32">
        <EventSection />
        <MemberSection members={members} />
        <WorksSection works={works} />
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
    <section className="mb-16">
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
            image="/gotzgreen/gotzgreen-flyer.png"
          />
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
};

export const MemberSection = ({ members }: { members: any[] }) => {
  // メンバーを3行に分割
  const rows = 3;
  const memberRows = Array.from({ length: rows }, (_, rowIndex) =>
    members.filter((_, index) => index % rows === rowIndex)
  );

  return (
    <section className="mb-16">
      <ScrollAnimation variant="slideUp" duration={1.4} delay={0.3}>
        <div className="relative mb-6">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black italic text-green-500 tracking-tighter scale-x-110">
            MEMBERS
          </h2>
          <h2
            className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-green-500/20 translate-y-2 translate-x-2 -z-10 tracking-tighter scale-x-110"
            aria-hidden="true"
          >
            MEMBERS
          </h2>
          <h2
            className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-green-500/10 translate-y-4 translate-x-4 -z-20 tracking-tighter scale-x-110"
            aria-hidden="true"
          >
            MEMBERS
          </h2>
        </div>
      </ScrollAnimation>

      <ScrollAnimation variant="fadeIn" duration={1.2} delay={0.5}>
        <div className="space-y-3 overflow-hidden">
          {memberRows.map((rowMembers, rowIndex) => (
            <div
              key={rowIndex}
              className="relative overflow-hidden"
              style={{
                paddingLeft: rowIndex % 2 === 1 ? "60px" : "0",
              }}
            >
              <div
                className="flex gap-3 animate-scroll-left"
                style={{ width: "200%" }}
              >
                {/* 元のコンテンツ */}
                <div className="flex gap-3" style={{ flex: "0 0 50%" }}>
                  {rowMembers.map((member) => (
                    <MemberCard
                      key={member.id}
                      name={member.name}
                      avatar={member.avatar}
                      role={member.role}
                      bio={member.bio}
                      socialLinks={member.socialLinks}
                    />
                  ))}
                </div>
                {/* 複製コンテンツ（無限ループ用） */}
                <div className="flex gap-3" style={{ flex: "0 0 50%" }}>
                  {rowMembers.map((member) => (
                    <MemberCard
                      key={`${member.id}-duplicate`}
                      name={member.name}
                      avatar={member.avatar}
                      role={member.role}
                      bio={member.bio}
                      socialLinks={member.socialLinks}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimation>
    </section>
  );
};

export const WorksSection = ({ works }: { works: any[] }) => {
  return (
    <section className="mb-16 -mx-6 lg:-mx-8 px-6 lg:px-8 py-12 bg-yellow-400">
      <div className="max-w-screen-xl mx-auto">
        <ScrollAnimation variant="slideUp" duration={1.4} delay={0.3}>
          <div className="relative mb-8">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black italic text-purple-500 tracking-tighter scale-x-110">
              WORKS
            </h2>
            <h2
              className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-purple-500/20 translate-y-2 translate-x-2 -z-10 tracking-tighter scale-x-110"
              aria-hidden="true"
            >
              WORKS
            </h2>
            <h2
              className="absolute top-0 left-0 text-5xl md:text-8xl lg:text-9xl font-black italic text-purple-500/10 translate-y-4 translate-x-4 -z-20 tracking-tighter scale-x-110"
              aria-hidden="true"
            >
              WORKS
            </h2>
          </div>
        </ScrollAnimation>

        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          {works.map((work) => (
            <StaggerItem key={work.id}>
              <WorkCard
                title={work.title}
                subtitle={work.subtitle}
                image={work.image}
                isNew={work.isNew}
                tags={work.tags}
                socialLinks={work.socialLinks}
                members={work.members}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const DISCORD_INVITE_URL =
  "https://discord.com/invite/BwtTvC8Fny?fbclid=PAZXh0bgNhZW0CMTEAAac1PFb-eN8Jh94RDx-Ej9NW2sYksBPX4LMdPLokE9mQfwvoWMe-girvS9dZww_aem_dcecfxWLJvu-LJkts3CUEw";

export default function Index() {
  const { works, members } = useLoaderData<typeof loader>();

  return (
    <div className="w-full min-h-screen bg-[#eeeeee]">
      {/* Right Side - Content */}
      <Header />
      <MainContent works={works} members={members} />
      <BottomBar discordInviteUrl={DISCORD_INVITE_URL} />
    </div>
  );
}
