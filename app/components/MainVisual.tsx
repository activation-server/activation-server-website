export const MainVisual = () => {
  const videoSources = [
    "/main-visual-1.mov",
    "/main-visual-2.mov",
    "/main-visual-3.mov",
    "/main-visual-4.mov",
    "/main-visual-5.mov",
  ];

  // Select a random video source
  const randomVideoSrc =
    videoSources[Math.floor(Math.random() * videoSources.length)];

  return (
    <div className="relative w-full h-[400px] lg:w-3/5 lg:h-screen">
      <video
        src={randomVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-2">活性化</h2>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4">サーバー</h2>
        </div>
      </div>
    </div>
  );
};
