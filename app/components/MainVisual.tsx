export const MainVisual = () => {
  const discordInviteUrl = "https://discord.com/invite/BwtTvC8Fny?fbclid=PAZXh0bgNhZW0CMTEAAac1PFb-eN8Jh94RDx-Ej9NW2sYksBPX4LMdPLokE9mQfwvoWMe-girvS9dZww_aem_dcecfxWLJvu-LJkts3CUEw";

  return (
    <a
      href={discordInviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full cursor-pointer hover:opacity-90 transition-opacity"
    >
      {/* Mobile version - display image */}
      <img
        src="/actsrv-main-visual-mob.png"
        alt="活性化サーバー - Discordに参加"
        className="w-full h-auto lg:hidden"
      />

      {/* Desktop version - display image */}
      <img
        src="/actsrv-main-visual.png"
        alt="活性化サーバー - Discordに参加"
        className="hidden lg:block w-full h-auto"
      />
    </a>
  );
};
