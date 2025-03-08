import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BasicCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/basic-card";

const meta: Meta<typeof BasicCard> = {
  title: "basic/Card",
  component: BasicCard,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the card",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof BasicCard>;

// Basic Card
export const Default: Story = {
  args: {
    className: "w-[350px]",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Card content goes here. This is the main content area of the card.
          </p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </>
    ),
  },
};

// Card with custom styling
export const CustomStyling: Story = {
  args: {
    className: "w-[350px] bg-blue-50 border-blue-200",
    children: (
      <>
        <CardHeader className="text-blue-800">
          <CardTitle>Custom Styled Card</CardTitle>
          <CardDescription className="text-blue-600">
            With custom colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has custom background and border colors.</p>
        </CardContent>
        <CardFooter className="border-t border-blue-200 pt-4">
          <p className="text-blue-700 text-sm">Custom footer</p>
        </CardFooter>
      </>
    ),
  },
};

// Card without footer
export const NoFooter: Story = {
  args: {
    className: "w-[350px]",
    children: (
      <>
        <CardHeader>
          <CardTitle>No Footer Card</CardTitle>
          <CardDescription>This card has no footer</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card example doesn't include a footer component.</p>
        </CardContent>
      </>
    ),
  },
};

// Card without header
export const NoHeader: Story = {
  args: {
    className: "w-[350px]",
    children: (
      <>
        <CardContent className="pt-0">
          <p>This card example doesn't include a header component.</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </>
    ),
  },
};

// Content-only card
export const ContentOnly: Story = {
  args: {
    className: "w-[350px]",
    children: (
      <CardContent className="py-0">
        <p>This card only has content without header or footer.</p>
      </CardContent>
    ),
  },
};

// Interactive card with hover effect
export const Interactive: Story = {
  args: {
    className:
      "w-[350px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>This card has hover effects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover over this card to see the interactive effects.</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Click me</p>
        </CardFooter>
      </>
    ),
  },
};

// Card with nested content
export const NestedContent: Story = {
  args: {
    className: "w-[350px]",
    children: (
      <>
        <CardHeader>
          <CardTitle>Nested Content</CardTitle>
          <CardDescription>Card with complex nested content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Nested item 1</p>
              <p className="text-xs text-muted-foreground">
                Description for item 1
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Nested item 2</p>
              <p className="text-xs text-muted-foreground">
                Description for item 2
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </>
    ),
  },
};

// Card with horizontal layout
export const HorizontalLayout: Story = {
  args: {
    className: "w-[500px] flex-row",
    children: (
      <>
        <div className="w-1/3 bg-muted flex items-center justify-center rounded-l-xl">
          <div className="p-4">Image Placeholder</div>
        </div>
        <div className="w-2/3">
          <CardHeader>
            <CardTitle>Horizontal Card</CardTitle>
            <CardDescription>Card with horizontal layout</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for horizontal card layout.</p>
          </CardContent>
        </div>
      </>
    ),
  },
};
