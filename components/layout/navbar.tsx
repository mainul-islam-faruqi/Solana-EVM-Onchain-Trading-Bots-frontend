"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnection } from "@/components/wallet/WalletConnection";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  LineChart,
  Settings,
  Menu,
  X,
  History,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Bot Builder",
    icon: Bot,
    href: "/bot-builder",
    color: "text-violet-500",
  },
  {
    label: "Strategy Library",
    icon: BookOpen,
    href: "/strategies",
    color: "text-emerald-500",
  },
  {
    label: "Analytics",
    icon: LineChart,
    href: "/analytics",
    color: "text-pink-700",
  },
  {
    label: "History",
    icon: History,
    href: "/history",
    color: "text-orange-700",
  },
  {
    label: "Documentation",
    icon: BookOpen,
    href: "/docs",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-700",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-gray-200 bg-white h-16">
      <div className="flex items-center">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col">
              <div className="px-4 py-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
              </div>
              <div className="flex flex-col space-y-2 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100",
                      pathname === route.href ? "bg-gray-100" : ""
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-x-2">
          <Bot className="h-8 w-8 text-violet-500" />
          <span className="font-bold text-xl hidden md:block">Trading Bot</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 mx-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium transition-colors hover:text-violet-500",
                pathname === route.href ? "text-violet-500" : "text-gray-500"
              )}
            >
              <route.icon className={cn("h-4 w-4", route.color)} />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-x-3">
        <WalletConnection />
      </div>
    </div>
  );
} 