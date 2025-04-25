"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useState } from "react";
import { Briefcase, Menu, X } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
}

// Reusable NavLink component for public header
const NavLink = ({ href, children, isActive, isMobile }: NavLinkProps) => {
  const baseClasses = "font-medium transition-colors";
  const mobileClasses = "block w-full py-3 text-base";
  const desktopClasses = "text-sm";
  const activeClasses = "text-primary";
  const inactiveClasses = "text-foreground/70 hover:text-primary";

  const className = `${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

// Public navigation items


export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <Briefcase size={20} />
              </div>
              <span className="hidden text-lg font-semibold md:block">
                Education & Career Guidance
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            
              
            
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button size="sm" className="shadow-sm" asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="ml-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              
              <div className="mt-4 flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button className="w-full justify-center" asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
