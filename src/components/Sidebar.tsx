import {
  Home,
  TrendingUp,
  DollarSign,
  Receipt,
  Plane,
  CreditCard,
  Users,
  FileText,
  Building2,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  isMobile?: boolean;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home, badge: "27" },
  { id: "insights", label: "Insights", icon: TrendingUp },
  { id: "manage-spend", label: "Manage spend", icon: DollarSign },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "bill-pay", label: "Bill Pay", icon: CreditCard },
  {
    id: "financial-accounts",
    label: "Financial Accounts",
    icon: Users,
    badge: "1",
  },
  { id: "accounting", label: "Accounting", icon: FileText, badge: "276" },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "policy", label: "Policy", icon: FileText },
  { id: "company", label: "Company", icon: Building2 },
];

export function Sidebar({
  isOpen,
  onToggle,
  activeMenu,
  onMenuClick,
  isMobile = false,
}: SidebarProps) {
  const [show, setShow] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-neutral-50 border-r border-neutral-200 transition-all duration-300",
        isMobile ? "fixed left-0 top-0 bottom-0 z-40 w-[240px]" : "relative",
        isMobile && !isOpen && "-translate-x-full",
        !isMobile && (isOpen ? "w-[240px]" : "w-[60px]")
      )}
      onMouseEnter={() => !isMobile && setShow(true)}
      onMouseLeave={() => !isMobile && setShow(false)}
    >
      {/* Logo/Header */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-neutral-200">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-semibold">Mohit</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={`h-8 w-8 ${!show && isOpen ? "!opacity-0" : ""}`}
          disabled={!show}
        >
          <PanelRight size={16} />
        </Button>
      </div>

      {/* Setup Guide */}
      {isOpen && (
        <div className="px-3 py-3 border-b border-neutral-200">
          <div className="text-xs text-neutral-600 mb-1">Setup guide</div>
          <div className="text-xs  hover:underline cursor-pointer">
            New: Move your spend onto Ramp
          </div>
          <div className="h-2 bg-neutral-100 rounded-none overflow-hidden mt-4">
            <div className="h-full flex">
              <div className="bg-[#439858]" style={{ width: "60%" }}></div>
              <div className="bg-gray-200" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-neutral-200 text-neutral-900 font-medium"
                  : "text-neutral-700 hover:bg-neutral-100",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-xs rounded-md",
                        item.badge === "276"
                          ? "bg-[#E4F222] text-yellow-900"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ask Ramp */}
      {isOpen && (
        <div className="p-3 border-t border-neutral-200">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
            <span className="text-lg">💬</span>
            <span>Ask Ramp</span>
          </button>
        </div>
      )}
    </div>
  );
}
