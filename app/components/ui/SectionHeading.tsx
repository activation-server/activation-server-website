interface SectionHeadingProps {
  text: string;
  colorClass: string;
}

/**
 * セクション見出しコンポーネント
 * 3層のシャドウエフェクトを持つ大きな見出しを表示
 */
export const SectionHeading = ({ text, colorClass }: SectionHeadingProps) => {
  const baseClasses =
    "text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter scale-x-110";

  return (
    <div className="relative mb-6">
      <h2 className={`${baseClasses} ${colorClass}`}>{text}</h2>
      <h2
        className={`absolute top-0 left-0 ${baseClasses} ${colorClass} opacity-20 translate-y-2 translate-x-2 -z-10`}
        aria-hidden="true"
      >
        {text}
      </h2>
      <h2
        className={`absolute top-0 left-0 ${baseClasses} ${colorClass} opacity-10 translate-y-4 translate-x-4 -z-20`}
        aria-hidden="true"
      >
        {text}
      </h2>
    </div>
  );
};
