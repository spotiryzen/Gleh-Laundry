import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/laundryData';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenChat: () => void;
}

export function Navbar({ onOpenChat }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleMobileChatClick = () => {
    setMobileMenuOpen(false);
    onOpenChat();
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? 'border-b border-[#087F75]/12 bg-white/95 backdrop-blur-md'
          : 'border-b border-transparent bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#beranda"
          aria-label="Gleh Laundry - Beranda"
          className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-[#087F75]"
        >
          <BrandLogo />
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 text-sm font-medium text-[#173C38]/80 transition-colors duration-150 hover:text-[#087F75]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action & Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="hidden min-h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-xl bg-[#087F75] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#064E48] cursor-pointer sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Tanya Gleh AI</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#087F75]/15 text-[#173C38] transition-colors hover:bg-[#F0FAF8] cursor-pointer lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi seluler"
          className="border-t border-[#087F75]/12 bg-white px-4 pb-5 pt-3 shadow-sm lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-[#173C38] transition-colors hover:bg-[#F0FAF8] hover:text-[#087F75]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#087F75]/10 pt-4">
            <button
              type="button"
              onClick={handleMobileChatClick}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087F75] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#064E48] cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Tanya Gleh AI</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
