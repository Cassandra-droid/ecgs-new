import { usePathname } from "next/navigation";
import { NavItem } from "./nav-item";
import { navigationItems } from "@/data";
import { Settings, User } from "lucide-react";

export const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <div className="fixed inset-0 top-[66px] z-40 bg-background/95 backdrop-blur-sm md:hidden">
      <div className="container flex flex-col space-y-1 px-4 py-4">
        {navigationItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            isMobile
            isActive={isActive(item.href)}
            onClick={onClose}
          >
            {item.name}
          </NavItem>
        ))}
        <div className="my-2 h-px w-full bg-border" />
        <NavItem
          href="/profile"
          icon={User}
          isMobile
          isActive={isActive("/profile")}
          onClick={onClose}
        >
          Profile
        </NavItem>
        <NavItem
          href="/settings"
          icon={Settings}
          isMobile
          isActive={isActive("/settings")}
          onClick={onClose}
        >
          Settings
        </NavItem>
      </div>
    </div>
  );
};
