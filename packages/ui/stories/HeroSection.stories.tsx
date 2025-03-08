import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "../components/composed/hero-section";
import {
  ArrowRight,
  Play,
  ChevronRight,
  Download,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";

const meta: Meta<typeof HeroSection> = {
  title: "Composed/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Hero Section Component

A highly customizable hero section component for creating impactful page headers across different applications.

## Features

- Flexible content positioning and alignment
- Support for background images and gradients
- Customizable overlay colors and opacity
- Optional foreground images with positioning options
- Call-to-action buttons with various styles
- Decorative wave/curve option
- **Fully responsive design with mobile-first approach**
- Animation options

## Theme Variants

The HeroSection component offers several built-in theme variants:

- **default**: Dark background with white text
- **light**: Light background with dark text
- **primary**: Blue gradient background with white text
- **secondary**: Purple-pink gradient background with white text
- **accent**: Teal-emerald gradient background with white text
- **custom**: Use your own background and text colors

## Responsive Behavior

The HeroSection component is designed to be fully responsive across all device sizes:

- **Mobile**: Content stacks vertically, foreground images adjust or hide based on available space
- **Tablet**: Balanced layout with appropriate spacing and font sizes
- **Desktop**: Full layout with optimal content positioning

## Usage Example

\`\`\`jsx
<HeroSection
  variant="primary"
  heading="Welcome to Our Platform"
  subheading="The easiest way to build beautiful websites"
  backgroundImage="/images/hero-bg.jpg"
  overlayOpacity={60}
  actions={[
    { label: "Get Started", primary: true },
    { label: "Learn More", variant: "dark-outline" }
  ]}
  wave={true}
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    heading: {
      control: "text",
      description: "Main heading text",
    },
    subheading: {
      control: "text",
      description: "Subheading or description text",
    },
    backgroundImage: {
      control: "text",
      description: "Background image URL",
    },
    variant: {
      control: {
        type: "select",
        options: [
          "default",
          "light",
          "primary",
          "secondary",
          "accent",
          "custom",
        ],
      },
      description: "Theme variant to use",
    },
    backgroundColor: {
      control: "text",
      description: "Background color (used if variant is 'custom' or no image)",
    },
    textColor: {
      control: "text",
      description: "Text color (used if variant is 'custom')",
    },
    overlayOpacity: {
      control: { type: "range", min: 0, max: 100, step: 5 },
      description: "Background overlay opacity (0-100)",
    },
    align: {
      control: { type: "radio", options: ["left", "center", "right"] },
      description: "Content alignment",
    },
    contentWidth: {
      control: { type: "radio", options: ["narrow", "medium", "wide", "full"] },
      description: "Content width",
    },
    padding: {
      control: { type: "radio", options: ["small", "medium", "large", "none"] },
      description: "Vertical padding",
    },
    minHeight: {
      control: "text",
      description: "Minimum height",
    },
    fullscreen: {
      control: "boolean",
      description: "Whether to make the hero fullscreen",
    },
    wave: {
      control: "boolean",
      description: "Whether to add a wave/curve at the bottom",
    },
    actions: {
      control: "object",
      description: "Call to action buttons",
    },
    animated: {
      control: "boolean",
      description: "Whether to animate the hero on entry",
    },
    foregroundImage: {
      control: "text",
      description:
        "Optional foreground image (e.g., product image, illustration)",
    },
    foregroundPosition: {
      control: { type: "radio", options: ["left", "right", "bottom"] },
      description: "Foreground image position",
    },
    foregroundWidth: {
      control: "text",
      description: "Foreground image width (percentage or pixel value)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

// Default hero with image background
export const Default: Story = {
  args: {
    variant: "default",
    heading: "Build beautiful websites faster",
    subheading:
      "A highly customizable UI component library for modern web applications",
    backgroundImage:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    overlayOpacity: 70,
    actions: [
      {
        label: "Get Started",
        primary: true,
        icon: <ArrowRight className="h-4 w-4" />,
      },
      { label: "Learn More", variant: "dark-outline" },
    ],
    align: "center",
    contentWidth: "medium",
    padding: "large",
    wave: true,
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A standard hero section with a background image, overlay, and call-to-action buttons. Fully responsive across all device sizes.",
      },
    },
  },
};

// Left-aligned with foreground image
export const WithForegroundImage: Story = {
  args: {
    variant: "default",
    heading: "Powerful analytics for your business",
    subheading:
      "Get insights into your data with our powerful analytics platform",
    align: "left",
    contentWidth: "full",
    padding: "large",
    actions: [
      { label: "Start Free Trial", primary: true },
      {
        label: "Watch Demo",
        variant: "outline",
        icon: <Play className="h-4 w-4" />,
      },
    ],
    foregroundImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    foregroundPosition: "right",
    foregroundWidth: "45%",
    foregroundAlt: "Analytics dashboard",
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A hero section with a foreground image positioned to the right. On mobile devices, the image will appear below the content or be sized appropriately to maintain readability.",
      },
    },
  },
};

// Gradient background
export const PrimaryGradient: Story = {
  args: {
    variant: "primary",
    heading: "Next-generation platform",
    subheading: "Build, deploy, and scale your applications with ease",
    align: "center",
    contentWidth: "medium",
    padding: "large",
    actions: [
      { label: "Get Started", primary: true, variant: "default" },
      { label: "Documentation", variant: "dark-outline", href: "#" },
    ],
    wave: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A hero section with a primary gradient background. The gradient maintains its visual appeal across all screen sizes.",
      },
    },
  },
};

// Secondary gradient
export const SecondaryGradient: Story = {
  args: {
    variant: "secondary",
    heading: "Transform your workflow",
    subheading: "Powerful tools to boost your productivity",
    align: "center",
    contentWidth: "medium",
    padding: "large",
    actions: [
      { label: "Get Started", primary: true, variant: "default" },
      { label: "Learn More", variant: "dark-outline", href: "#" },
    ],
    wave: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A hero section with a secondary gradient background. The purple-pink gradient creates a vibrant, energetic feel.",
      },
    },
  },
};

// Accent gradient
export const AccentGradient: Story = {
  args: {
    variant: "accent",
    heading: "Eco-friendly solutions",
    subheading: "Sustainable technology for a better future",
    align: "center",
    contentWidth: "medium",
    padding: "large",
    actions: [
      { label: "Explore", primary: true, variant: "default" },
      { label: "Our Mission", variant: "dark-outline", href: "#" },
    ],
    wave: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A hero section with an accent gradient background. The teal-emerald gradient creates a fresh, natural feel perfect for eco-friendly or health-related content.",
      },
    },
  },
};

// Light theme
export const LightTheme: Story = {
  args: {
    variant: "light",
    heading: "Simplify your workflow",
    subheading: "Streamline your processes and boost productivity",
    align: "center",
    contentWidth: "narrow",
    padding: "medium",
    actions: [{ label: "Try it Free", primary: true, variant: "default" }],
    foregroundImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    foregroundPosition: "bottom",
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A minimal hero section with light theme and an image positioned at the bottom. On smaller screens, the image scales proportionally to maintain visibility.",
      },
    },
  },
};

// Custom theme
export const CustomTheme: Story = {
  args: {
    variant: "custom",
    backgroundColor: "bg-amber-100",
    textColor: "text-amber-900",
    heading: "Introducing Our New Product",
    subheading:
      "The most advanced solution for your needs, now available for everyone",
    backgroundImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    overlayOpacity: 30,
    align: "left",
    contentWidth: "full",
    padding: "large",
    actions: [
      { label: "Pre-order Now", primary: true, variant: "default" },
      {
        label: "Learn More",
        variant: "outline",
        icon: <ChevronRight className="h-4 w-4" />,
      },
    ],
    foregroundImage:
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    foregroundPosition: "right",
    foregroundWidth: "40%",
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A product launch hero section with custom colors and a product image. This demonstrates how to use the 'custom' variant to apply your own color scheme.",
      },
    },
  },
};
