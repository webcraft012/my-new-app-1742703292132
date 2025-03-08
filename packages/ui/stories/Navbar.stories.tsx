import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "../components/composed/navbar";
import { Button } from "../components/ui/button";
import {
  Home,
  Info,
  Settings,
  Users,
  BookOpen,
  LifeBuoy,
  Mail,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";

const meta: Meta<typeof Navbar> = {
  title: "Composed/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A highly customizable responsive navigation bar component that adapts to different screen sizes.

## Features
- **Responsive Design**: Horizontal navigation for desktop and a collapsible side menu for mobile
- **Theme Variants**: Choose from default, dark, transparent, primary, or custom themes
- **Dropdown Support**: Nested navigation with dropdown menus
- **Positioning Options**: Static, sticky, or fixed positioning
- **Visual Customization**: Options for shadow, border, width, and padding
- **Mobile Customization**: Configurable mobile breakpoint and menu style

## Mobile Responsiveness
The Navbar automatically collapses into a side drawer menu on smaller screens. The mobile breakpoint can be customized.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["default", "dark", "transparent", "primary", "custom"],
      },
      description: "Visual style variant of the navbar",
    },
    position: {
      control: {
        type: "select",
        options: ["static", "sticky", "fixed"],
      },
      description: "Positioning behavior of the navbar",
    },
    shadow: {
      control: "boolean",
      description: "Whether to add a subtle shadow to the navbar",
    },
    bordered: {
      control: "boolean",
      description: "Whether to add a bottom border to the navbar",
    },
    maxWidth: {
      control: {
        type: "select",
        options: ["full", "wide", "default", "narrow"],
      },
      description: "Maximum width of the navbar content",
    },
    padding: {
      control: {
        type: "select",
        options: ["none", "small", "medium", "large"],
      },
      description: "Horizontal padding of the navbar",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the navbar items",
    },
    mobileBreakpoint: {
      control: {
        type: "select",
        options: ["sm", "md", "lg"],
      },
      description: "Breakpoint at which the navbar collapses to mobile view",
    },
    fullScreenMobile: {
      control: "boolean",
      description: "Whether the mobile menu should take up the full screen",
    },
    collapseOnScroll: {
      control: "boolean",
      description:
        "Whether the navbar should become smaller when scrolling down",
    },
    showDropdownIndicator: {
      control: "boolean",
      description:
        "Whether to show dropdown indicators for items with children",
    },
    backgroundColor: {
      control: "color",
      description: "Custom background color (only for custom variant)",
    },
    textColor: {
      control: "color",
      description: "Custom text color (only for custom variant)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// Simple logo component for examples
const Logo = () => (
  <div className="flex items-center gap-2 font-semibold text-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
    <span>WebCraft</span>
  </div>
);

// Sample navigation items
const navItems = [
  {
    label: "Home",
    href: "#",
    active: true,
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Features",
    href: "#",
    icon: <Info className="h-4 w-4" />,
  },
  {
    label: "Pricing",
    href: "#",
  },
  {
    label: "Resources",
    children: [
      {
        label: "Documentation",
        href: "#",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "Tutorials",
        href: "#",
      },
      {
        label: "Support",
        href: "#",
        icon: <LifeBuoy className="h-4 w-4" />,
      },
      {
        label: "Contact",
        href: "#",
        icon: <Mail className="h-4 w-4" />,
      },
    ],
  },
];

// Sample actions
const actions = (
  <div className="flex items-center gap-2">
    <Button variant="ghost" size="sm">
      Sign In
    </Button>
    <Button size="sm">Get Started</Button>
  </div>
);

// Default navbar
export const Default: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    shadow: true,
  },
};

// Dark variant
export const Dark: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    variant: "dark",
    shadow: true,
  },
};

// Transparent variant (for overlaying hero sections)
export const Transparent: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    variant: "transparent",
    position: "fixed",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Primary color variant
export const Primary: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    variant: "primary",
  },
};

// Custom color variant
export const Custom: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    variant: "custom",
    backgroundColor: "#1e293b",
    textColor: "#f8fafc",
  },
};

// Centered items
export const CenteredItems: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    centered: true,
    shadow: true,
  },
};

// Sticky navbar
export const Sticky: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    position: "sticky",
    shadow: true,
    collapseOnScroll: true,
  },
};

// Mobile menu showcase
export const MobileMenuShowcase: Story = {
  args: {
    brand: <Logo />,
    items: [
      {
        label: "Home",
        href: "#",
        active: true,
        icon: <Home className="h-4 w-4" />,
      },
      {
        label: "Features",
        href: "#",
        icon: <Info className="h-4 w-4" />,
      },
      {
        label: "Pricing",
        href: "#",
      },
      {
        label: "Resources",
        icon: <BookOpen className="h-4 w-4" />,
        children: [
          {
            label: "Documentation",
            href: "#",
            icon: <BookOpen className="h-4 w-4" />,
          },
          {
            label: "Tutorials",
            href: "#",
          },
          {
            label: "Support",
            href: "#",
            icon: <LifeBuoy className="h-4 w-4" />,
          },
        ],
      },
      {
        label: "Team",
        icon: <Users className="h-4 w-4" />,
        href: "#",
      },
      {
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        href: "#",
      },
    ],
    actions: (
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button variant="outline" className="w-full">
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
        <Button className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Get Started
        </Button>
      </div>
    ),
    shadow: true,
    mobileBreakpoint: "lg", // Force mobile view in the story
    variant: "default",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "This example showcases the mobile menu experience with proper spacing, icons, and nested navigation.",
      },
    },
  },
};

// Full screen mobile menu
export const FullScreenMobile: Story = {
  args: {
    brand: <Logo />,
    items: navItems,
    actions: actions,
    shadow: true,
    mobileBreakpoint: "lg", // Force mobile view in the story
    fullScreenMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "A full-screen mobile menu that takes up the entire viewport when opened.",
      },
    },
  },
};
