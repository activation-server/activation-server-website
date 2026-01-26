import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Header } from "~/components/Header";
import { ScrollAnimation } from "~/components/ScrollAnimation";
import { motion } from "framer-motion";
import { getEventsFromSheet, type Event } from "~/utils/googleSheets.server";
import { SITE_META } from "~/constants";
import { ArrowLeft, Calendar, ExternalLink, MapPin } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.event) {
    return [{ title: "Event Not Found | Activation Server" }];
  }

  const { event } = data;
  const title = `${event.title} - #${event.number} | Activation Server`;
  const description = event.description || SITE_META.description;
  const imageUrl = event.image || `${SITE_META.url}/actsrv-main-visual.png`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { eventId } = params;

  if (!eventId) {
    throw new Response("Event ID is required", { status: 400 });
  }

  let events: Event[] = [];

  try {
    events = await getEventsFromSheet();
  } catch (error) {
    console.error("Failed to load events:", error);
    throw new Response("Failed to load event data", { status: 500 });
  }

  // eventIdはevent.idと一致
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    throw new Response("Event not found", { status: 404 });
  }

  // イベントが今後のものか判定
  const isUpcoming = event.date ? new Date(event.date) >= new Date() : false;

  return json({ event: { ...event, isUpcoming } });
};

export default function EventDetail() {
  const { event } = useLoaderData<typeof loader>();

  // flyerを優先的に使用、なければimageを使用
  const displayImage = event.flyer || event.image;

  // カラーコード（#で始まる）かTailwindクラスか判定
  const isColorCode = event.color?.startsWith("#");
  const bgColor = isColorCode ? event.color : undefined;
  const bgClass = !isColorCode && event.color ? event.color : "bg-blue-500";

  return (
    <div className="w-full min-h-screen bg-[#eeeeee]">
      <Header />

      <div className="w-full lg:h-screen lg:overflow-y-auto">
        {/* Hero Section - Flyer */}
        <ScrollAnimation variant="scale" duration={1.2}>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 pt-20 lg:pt-24 mb-6 lg:mb-8">
            <motion.div
              className="relative overflow-hidden shadow-2xl lg:max-w-2xl lg:mx-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
            >
              {displayImage ? (
                /* フライヤー画像を直接表示（チラシ風） */
                <div className="relative w-full">
                  <img
                    src={displayImage}
                    alt={event.title}
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                /* フライヤー画像がない場合のフォールバック */
                <div
                  className={`relative ${bgClass}`}
                  style={bgColor ? { backgroundColor: bgColor } : undefined}
                >
                  <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center p-12 text-white">
                      <div className="text-8xl lg:text-[12rem] font-black italic tracking-tighter mb-6">
                        #{event.number}
                      </div>
                      <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-center">
                        {event.title}
                      </h1>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </ScrollAnimation>

        {/* Event Details */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-12 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
            {/* Sidebar Info - モバイルでは上に、デスクトップでは右に */}
            <div className="space-y-4 lg:order-2">
              {/* Date & Time */}
              <ScrollAnimation variant="slideUp" duration={1.2} delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-lg relative">
                  {/* Status Badge - 右上 */}
                  {event.isUpcoming ? (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      UPCOMING
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FINISHED
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Calendar className="text-orange-500 mt-1" size={24} />
                    <div>
                      <div className="text-sm font-bold text-gray-500 mb-1">
                        DATE
                      </div>
                      <div className="text-xl font-bold">{event.date}</div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* External Link - Only show for past events */}
              {event.link && !event.isUpcoming && (
                <ScrollAnimation variant="slideUp" duration={1.2} delay={0.3}>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-500 text-white rounded-2xl p-6 shadow-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">イベント詳細</span>
                      <ExternalLink size={24} />
                    </div>
                  </a>
                </ScrollAnimation>
              )}
            </div>

            {/* Main Info */}
            <div className="lg:order-1 space-y-6">
              {/* Event Details */}
              {event.detail && (
                <ScrollAnimation variant="slideUp" duration={1.2} delay={0.4}>
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                    <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter mb-4 lg:mb-6">
                      DETAILS
                    </h2>
                    <div className="text-base lg:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.detail}
                    </div>
                  </div>
                </ScrollAnimation>
              )}
            </div>
          </div>

          {/* Location Map */}
          {event.location && (
            <ScrollAnimation variant="slideUp" duration={1.2} delay={0.5}>
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-orange-500" size={24} />
                  <h2 className="text-xl lg:text-2xl font-black italic tracking-tighter">
                    LOCATION
                  </h2>
                </div>
                <div className="w-full h-[300px] lg:h-[500px] rounded-xl overflow-hidden">
                  <iframe
                    src={event.location}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Event Location Map"
                  />
                </div>
              </div>
            </ScrollAnimation>
          )}

          {/* Back Link */}
          <ScrollAnimation variant="fadeIn" duration={0.8} delay={0.6}>
            <div className="mt-8 lg:mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity"
              >
                <ArrowLeft size={16} />
                Back to Events
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Floating Action Button for Upcoming Events */}
      {event.isUpcoming && event.link && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center lg:bottom-8">
          <motion.div
            className="bg-white/70 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-2xl border border-white/20"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
          >
            <motion.a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg lg:text-xl px-8 py-4 lg:px-12 lg:py-5 rounded-xl shadow-none transition-colors"
            >
              <ExternalLink size={24} />
              <span>Get Ticket</span>
            </motion.a>
          </motion.div>
        </div>
      )}
    </div>
  );
}
