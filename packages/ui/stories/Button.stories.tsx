import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "The visual style of the button",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    asChild: {
      control: "boolean",
      description: "Whether to render as a child component using Radix UI Slot",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    onClick: { action: "clicked" },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base Button
export const Default: Story = {
  args: {
    children: "Default Button",
    variant: "default",
    size: "default",
    className: "bg-blue-500",
    disabled: false,
    asChild: false,
  },
};

// Variants
export const Destructive: Story = {
  args: {
    children: "Destructive Button",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

// States
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

// Using asChild
export const AsLink: Story = {
  render: (args) => (
    <Button asChild {...args}>
      <a href="https://example.com">Link as Button</a>
    </Button>
  ),
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};

// Loading State Example
export const Loading: Story = {
  render: () => (
    <Button disabled className="relative">
      <span className="absolute inset-0 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
      </span>
      <span className="invisible">Loading</span>
    </Button>
  ),
};
