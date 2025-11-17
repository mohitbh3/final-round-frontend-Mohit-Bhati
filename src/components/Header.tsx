import {
  Search,
  Bell,
  Plus,
  User,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  PersonStanding,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
  activeMenu?: string;
}

const placeholders: Record<string, string> = {
  home: "Search home...",
  insights: "Search insights, reports...",
  "manage-spend": "Search spend management...",
  expenses: "Search expenses, receipts...",
  travel: "Search travel, trips, destinations...",
  "bill-pay": "Search bills, payments...",
  "financial-accounts": "Search accounts, balances...",
  accounting: "Search accounting entries...",
  vendors: "Search vendors, suppliers...",
  policy: "Search policies, rules...",
  company: "Search company settings...",
};

export function Header({ onMenuToggle, activeMenu }: HeaderProps = {}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const placeholder = placeholders[activeMenu || ""] || "Search for anything";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (!open) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center px-4 md:pl-10">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden mr-2"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 flex-1">
        {/* Search container */}
        <div className="relative flex items-center w-full bg-neutral-100 border border-neutral-200 rounded-md py-1.5 px-3 text-sm">
          {/* Shortcut badge */}
          <span className="flex items-center gap-0.5 bg-neutral-200 text-neutral-600 text-xs font-medium px-1.5 py-0.5 rounded-sm mr-2">
            <kbd className="px-0.5">Ctrl</kbd>
            <kbd className="px-0.5">K</kbd>
          </span>

          {/* Placeholder text */}
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-transparent focus:outline-none placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Mobile Search Icon */}
      <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden ml-auto">
        <Search className="h-4 w-4" />
      </Button>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            ref={btnRef}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <User className="!h-6 !w-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white" />
            <ChevronDown className="h-4 w-4 text-black" />
          </Button>

          {open && (
            <div
              ref={panelRef}
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-2 w-80 bg-white border border-neutral-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-800">
                    MS
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-neutral-900">
                      Michael Scott
                    </div>
                    <div className="text-xs text-neutral-500">
                      tanmay+admin_0@theta software.ai
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-neutral-100" />
              <nav className="py-2" aria-label="Profile options">
                <ul className="flex flex-col gap-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Traveler profile
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Set a delegate approver
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Employee handbook
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Refer & earn
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none">
                      Early access
                    </button>
                  </li>
                  <li>
                    <a
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Product updates</span>
                      <ExternalLink className="h-4 w-4 text-neutral-400" />
                    </a>
                  </li>
                  <li>
                    <div className="border-t border-neutral-100 mt-1" />
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none flex items-center gap-2">
                      <LogOut className="h-4 w-4 text-neutral-500" />
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full  bg-orange-500 hover:bg-orange-600"
        >
          <span className="text-xs font-bold">
            <PersonStanding />
          </span>
        </Button>
      </div>
    </header>
  );
}
