"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  TrendingUp,
  Plus,
  Menu,
  Home,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/app", icon: Home },
  { name: "Journal", href: "/app/journal", icon: BookOpen },
  { name: "Insights", href: "/app/insights", icon: TrendingUp },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="border-b bg-[#8b59fb]/80 backdrop-blur-sm sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/app"
            className="flex items-center gap-2 font-bold text-xl text-white"
            aria-label="Go to dashboard"
          >
            <Image
              src="/icon.png"
              alt="Clearview logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span>Clearview</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* New Entry Button */}
            <Link href="/app/journal/new">
              <Button className="bg-white text-[#8b59fb] hover:bg-gray-100 hover:text-[#8b59fb] font-medium">
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>New Entry</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                aria-label="Open mobile menu"
                aria-expanded={isOpen}
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav
                className="flex flex-col gap-4 mt-8"
                aria-label="Mobile navigation"
              >
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#8b59fb]/10 text-[#8b59fb]"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* New Entry Button for Mobile */}
                <Link href="/notes" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-white text-[#8b59fb] hover:bg-gray-100 hover:text-[#8b59fb] font-medium">
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span>New Entry</span>
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
