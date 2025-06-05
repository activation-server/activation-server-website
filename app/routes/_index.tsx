import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/Header";
import { MainVisual } from "~/components/MainVisual";

export const meta: MetaFunction = () => {
  return [
    { title: "Activation Server" },
    { name: "description", content: "Welcome to Activation Server!" },
  ];
};

export const loader = async () => {
  return null;
};

// Messages to display in Announcement bar

const MainContent = () => {
  return (
    <div className="w-full lg:w-2/5 lg:h-screen lg:overflow-y-auto">
      {/* Header */}
      <Header />

      {/* Right Side - Content */}
      <div className="p-6 lg:p-8">
        <section>
          <img
            src="/icon-horizontal.png"
            alt="Activation Server Logo"
            className="mb-6 mx-auto"
          />
        </section>
        {/* About Section */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">活性化サーバーとは</h3>
          <div className="bg-gray-200 h-32 flex items-center justify-center mb-6">
            <span className="text-gray-600">
              活性化サーバーは、活性化を目的としたサーバーです。
              <br />
              ここでは、様々な活動やイベントが行われます。
            </span>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mb-8">
          <div className="border-2 border-gray-300 p-6">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-600">毎日0時に更新される</span>
              <br />
              <span className="text-sm text-gray-600">365日目のカレンダー</span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square border border-gray-200 flex items-center justify-center text-xs"
                >
                  {i + 1 <= 31 ? i + 1 : ""}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section>
          <h3 className="text-xl font-bold mb-4">活動</h3>
          <div className="space-y-4">
            <div className="border border-gray-300 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  活性化サーバーの活動（仮名）
                </span>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-700">最新のお知らせ</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex-1 border border-gray-300 p-4 h-32">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500 h-24 flex items-center justify-center">
                    コンテンツエリア
                  </span>
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className="w-full h-16 bg-gray-100 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function Index() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Side - Image */}
      <MainVisual />

      {/* Right Side - Content */}
      <MainContent />
    </div>
  );
}
