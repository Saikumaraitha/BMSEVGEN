import { useLocation } from "react-router-dom";
import bmsLogoIcon from "../../assets/icons/bms.svg";
import AiIcon from "../../assets/icons/ai.svg?react";

function TopBar() {
  const location = useLocation();
  return (
    <header className="relative flex-shrink-0 bg-white border-b-2 border-brand-primary">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-primary opacity-30" />

      <div className="flex items-center justify-between px-4 md:px-6 h-[60px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={bmsLogoIcon} alt="Logo" />
          <span className="font-heading font-bold text-lg hidden sm:inline">
            <span className="text-brand-primary">EvGen</span>
            <span className="text-neutral-900">Studio</span>
          </span>
        </div>
        {/* AI badge */}
        {location.pathname !== "/" ? (
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-topbar-ai-badge text-xs text-topbar-text font-semibold font-heading whitespace-nowrap">
            <AiIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>AI Generated Content- verify before use</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

export default TopBar;
