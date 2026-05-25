import bmsLogoIcon from "../../assets/icons/bms.svg";
import SparkleAiIcon from '../../assets/icons/sparkle-ai.svg?react'

function TopBar() {

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

        {/* EvGen AI button */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors"
        >
          <SparkleAiIcon className="w-4 h-4" aria-hidden="true" />
          EvGen AI
        </button>
      </div>
    </header>
  );
}

export default TopBar;
