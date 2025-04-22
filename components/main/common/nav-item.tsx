import Link from "next/link";

export const NavItem = ({
  href,
  icon: Icon,
  children,
  isMobile = false,
  isActive,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isMobile?: boolean;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const baseClasses =
    "flex items-center rounded-md font-medium transition-colors";
  const mobileClasses = "py-3 px-4 text-base hover:bg-primary/10 w-full";
  const desktopClasses = "px-3 py-2 text-sm";
  const activeClasses = "text-primary font-medium";
  const inactiveClasses = "text-foreground/70 hover:text-foreground";

  const className = `${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${isActive ? activeClasses : inactiveClasses}`;

  return (
    <Link href={href} className={className} onClick={onClick}>
      <Icon className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} mr-2`} />
      {children}
    </Link>
  );
};
