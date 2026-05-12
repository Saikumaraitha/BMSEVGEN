import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bmsLogoIcon from "../../assets/icons/bms.svg";
import SparkleAiIcon from '../../assets/icons/sparkle-ai.svg?react';
import LogoutIcon from '../../assets/icons/logout.svg?react';
import { AUTH_KEYS } from "../../constants/authConstants";

function TopBar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.AUTH_TOKEN);
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = "U";

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

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* EvGen AI button */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors"
          >
            <SparkleAiIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>EvGen AI</span>
          </button>

          {/* User profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-brand-primary text-white text-xs font-semibold flex items-center justify-center hover:bg-brand-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              aria-label="User menu"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 z-50 overflow-hidden">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error-dark font-medium hover:bg-error-bg transition-colors"
                  >
                    <LogoutIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
