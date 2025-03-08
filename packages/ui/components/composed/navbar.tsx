import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
} from "../ui/sheet";
import { Menu, X, ChevronDown, Home, Info } from "lucide-react";

export type NavbarVariant =
  | "default" // Light background with dark text
  | "dark" // Dark background with light text
  | "transparent" // Transparent background that can overlay content
  | "primary" // Primary color background
  | "custom"; // Custom styling

export type NavbarPosition =
  | "static" // Normal flow of the document
  | "sticky" // Sticks to the top when scrolling
  | "fixed"; // Fixed at the top of the viewport

export interface NavItem {
  /** Label to display */
  label: string;
  /** URL to navigate to */
  href?: string;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether this item should be highlighted */
  highlight?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Child items for dropdown */
  children?: NavItem[];
}

export interface NavbarProps {
  /** Brand/logo element */
  brand: React.ReactNode;
  /** Navigation items */
  items?: NavItem[];
  /** Right-aligned items or actions */
  actions?: React.ReactNode;
  /** Navbar variant */
  variant?: NavbarVariant;
  /** Navbar position */
  position?: NavbarPosition;
  /** Whether to add a subtle shadow */
  shadow?: boolean;
  /** Whether to add a bottom border */
  bordered?: boolean;
  /** Maximum width of the navbar content */
  maxWidth?: "full" | "wide" | "default" | "narrow";
  /** Padding size */
  padding?: "none" | "small" | "medium" | "large";
  /** Custom background color (for custom variant) */
  backgroundColor?: string;
  /** Custom text color (for custom variant) */
  textColor?: string;
  /** Whether to center the navbar items */
  centered?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS classes for the mobile menu */
  mobileMenuClassName?: string;
  /** Custom mobile breakpoint */
  mobileBreakpoint?: "sm" | "md" | "lg";
  /** Whether to use a full-screen mobile menu */
  fullScreenMobile?: boolean;
  /** Custom mobile menu trigger */
  mobileMenuTrigger?: React.ReactNode;
  /** Whether to collapse the navbar on scroll */
  collapseOnScroll?: boolean;
  /** Whether to show a dropdown indicator for items with children */
  showDropdownIndicator?: boolean;
}

// Theme variant configurations
const navbarVariants: Record<
  NavbarVariant,
  {
    base: string;
    text: string;
    border: string;
    activeItem: string;
    hoverItem: string;
  }
> = {
  default: {
    base: "bg-white",
    text: "text-slate-800",
    border: "border-slate-200",
    activeItem: "text-slate-900 font-medium",
    hoverItem: "hover:text-slate-900 hover:bg-slate-50",
  },
  dark: {
    base: "bg-slate-900",
    text: "text-slate-200",
    border: "border-slate-700",
    activeItem: "text-white font-medium",
    hoverItem: "hover:text-white hover:bg-slate-800",
  },
  transparent: {
    base: "bg-transparent",
    text: "text-slate-700",
    border: "border-transparent",
    activeItem: "text-slate-900 font-medium",
    hoverItem: "hover:text-slate-900",
  },
  primary: {
    base: "bg-primary",
    text: "text-primary-foreground",
    border: "border-primary/20",
    activeItem: "font-medium",
    hoverItem: "hover:bg-primary/90",
  },
  custom: {
    base: "",
    text: "",
    border: "border-slate-200",
    activeItem: "font-medium",
    hoverItem: "hover:opacity-80",
  },
};

// Position classes
const positionClasses: Record<NavbarPosition, string> = {
  static: "",
  sticky: "sticky top-0 z-40",
  fixed: "fixed top-0 left-0 right-0 z-40",
};

// Max width classes
const maxWidthClasses = {
  full: "w-full",
  wide: "max-w-7xl",
  default: "max-w-6xl",
  narrow: "max-w-4xl",
};

// Padding classes
const paddingClasses = {
  none: "px-0",
  small: "px-4",
  medium: "px-6",
  large: "px-8",
};

export function Navbar({
  brand,
  items = [],
  actions,
  variant = "default",
  position = "static",
  shadow = false,
  bordered = false,
  maxWidth = "default",
  padding = "medium",
  backgroundColor,
  textColor,
  centered = false,
  className,
  mobileMenuClassName,
  mobileBreakpoint = "md",
  fullScreenMobile = false,
  mobileMenuTrigger,
  collapseOnScroll = false,
  showDropdownIndicator = true,
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Get theme configuration based on variant
  const theme = navbarVariants[variant];

  // Use custom colors if provided and variant is 'custom'
  const bgColor =
    variant === "custom" && backgroundColor ? backgroundColor : theme.base;
  const txtColor = variant === "custom" && textColor ? textColor : theme.text;

  // Handle scroll events for collapsible navbar
  React.useEffect(() => {
    if (!collapseOnScroll) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [collapseOnScroll]);

  // Determine mobile breakpoint class
  const hiddenClass = `hidden ${mobileBreakpoint}:flex`;
  const visibleClass = `flex ${mobileBreakpoint}:hidden`;

  // Determine navbar height based on scroll state
  const heightClass = collapseOnScroll && isScrolled ? "h-14" : "h-16";

  return (
    <nav
      className={cn(
        "w-full transition-all duration-200",
        bgColor,
        txtColor,
        positionClasses[position],
        heightClass,
        bordered && "border-b",
        bordered && theme.border,
        shadow && "shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto h-full flex items-center justify-between",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
        )}
      >
        {/* Brand/Logo */}
        <div className="flex items-center shrink-0">{brand}</div>

        {/* Desktop Navigation */}
        <div
          className={cn(
            "items-center gap-1",
            hiddenClass,
            centered && "mx-auto",
          )}
        >
          {items.map((item, index) => (
            <NavbarItem
              key={index}
              item={item}
              theme={theme}
              showDropdownIndicator={showDropdownIndicator}
            />
          ))}
        </div>

        {/* Desktop Actions */}
        {actions && <div className={hiddenClass}>{actions}</div>}

        {/* Mobile Menu Trigger */}
        <div className={visibleClass}>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                {mobileMenuTrigger || <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                "flex flex-col p-0 pt-0",
                bgColor,
                txtColor,
                fullScreenMobile && "w-screen sm:max-w-full",
                mobileMenuClassName,
              )}
            >
              <div className="px-4 py-4 flex justify-between items-center border-b">
                <div className="flex-1">{brand}</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>

              <div className="flex flex-col py-6 px-4 overflow-y-auto">
                {items.map((item, index) => (
                  <MobileNavItem
                    key={index}
                    item={item}
                    theme={theme}
                    onSelect={() => setIsOpen(false)}
                  />
                ))}
              </div>

              {actions && (
                <div className="mt-auto border-t py-4 px-4">{actions}</div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation item
function NavbarItem({
  item,
  theme,
  showDropdownIndicator,
}: {
  item: NavItem;
  theme: (typeof navbarVariants)[keyof typeof navbarVariants];
  showDropdownIndicator: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle dropdown hover
  const handleMouseEnter = () => {
    if (item.children?.length) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (item.children?.length) {
      setIsOpen(false);
    }
  };

  // Base item styles
  const itemClasses = cn(
    "px-3 py-2 rounded-md text-sm transition-colors relative flex items-center",
    item.active ? theme.activeItem : theme.hoverItem,
    item.highlight && "bg-primary/10 text-primary",
  );

  // If the item has children, render a dropdown
  if (item.children?.length) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(itemClasses, "gap-1")}
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
          {showDropdownIndicator && <ChevronDown className="ml-1 h-3 w-3" />}
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {item.children.map((child, idx) => (
                <a
                  key={idx}
                  href={child.href}
                  className={cn(
                    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    child.active && "bg-gray-100 font-medium",
                  )}
                  role="menuitem"
                  onClick={(e) => {
                    if (child.onClick) {
                      e.preventDefault();
                      child.onClick();
                    }
                    setIsOpen(false);
                  }}
                >
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular item (no children)
  return item.href ? (
    <a
      href={item.href}
      className={itemClasses}
      onClick={(e) => {
        if (item.onClick) {
          e.preventDefault();
          item.onClick();
        }
      }}
    >
      {item.icon && <span className="mr-2">{item.icon}</span>}
      {item.label}
    </a>
  ) : (
    <button className={itemClasses} onClick={item.onClick}>
      {item.icon && <span className="mr-2">{item.icon}</span>}
      {item.label}
    </button>
  );
}

// Mobile navigation item
function MobileNavItem({
  item,
  theme,
  onSelect,
}: {
  item: NavItem;
  theme: (typeof navbarVariants)[keyof typeof navbarVariants];
  onSelect: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Base item styles
  const itemClasses = cn(
    "flex items-center justify-between w-full px-4 py-3 mb-1 rounded-md text-base transition-colors",
    item.active ? theme.activeItem : theme.hoverItem,
    item.highlight && "bg-primary/10 text-primary",
  );

  // If the item has children, render an expandable section
  if (item.children?.length) {
    return (
      <div className="w-full mb-2">
        <button className={itemClasses} onClick={() => setIsOpen(!isOpen)}>
          <span className="flex items-center">
            {item.icon && <span className="mr-3">{item.icon}</span>}
            {item.label}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="ml-4 mt-1 border-l-2 pl-4 space-y-1">
            {item.children.map((child, idx) => (
              <a
                key={idx}
                href={child.href}
                className={cn(
                  "block px-4 py-2 rounded-md text-base",
                  child.active ? theme.activeItem : theme.hoverItem,
                )}
                onClick={(e) => {
                  if (child.onClick) {
                    e.preventDefault();
                    child.onClick();
                  }
                  onSelect();
                }}
              >
                <span className="flex items-center">
                  {child.icon && (
                    <span className="mr-3 w-5 flex justify-center">
                      {child.icon}
                    </span>
                  )}
                  {child.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular item (no children)
  return item.href ? (
    <a
      href={item.href}
      className={cn(itemClasses, "mb-2")}
      onClick={(e) => {
        if (item.onClick) {
          e.preventDefault();
          item.onClick();
        }
        onSelect();
      }}
    >
      <span className="flex items-center">
        {item.icon && (
          <span className="mr-3 w-5 flex justify-center">{item.icon}</span>
        )}
        {item.label}
      </span>
    </a>
  ) : (
    <button
      className={cn(itemClasses, "mb-2")}
      onClick={() => {
        if (item.onClick) {
          item.onClick();
        }
        onSelect();
      }}
    >
      <span className="flex items-center">
        {item.icon && (
          <span className="mr-3 w-5 flex justify-center">{item.icon}</span>
        )}
        {item.label}
      </span>
    </button>
  );
}
