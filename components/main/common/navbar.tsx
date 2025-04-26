"use client";

import { ModeToggle } from "@/components/common/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationItems } from "@/data";
import { useAuth } from "@/hooks/use-auth";
import { SessionUser } from "@/types";
import { Briefcase, LogOut, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavItem } from "./nav-item";
import { MobileMenu } from "./mobile-menu";

interface NavbarProps {
  user: SessionUser;
}

export function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = !!user;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
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

          {/* Desktop Navigation - Only shown when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActive(item.href)}
                >
                  {item.name}
                </NavItem>
              ))}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative ml-2 h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user?.image || "/placeholder.svg?height=32&width=32"
                          }
                          alt={user?.username || "User"}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="border-b border-border px-2 py-1.5 text-sm font-medium">
                      {user?.username || "User"}
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu button - only for authenticated users */}
                <div className="ml-2 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={isAuthenticated && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
