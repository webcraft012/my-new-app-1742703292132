import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title of the card",
    },
    subtitle: {
      control: "text",
      description: "The subtitle or description of the card",
    },
    content: {
      control: "text",
      description: "The main content of the card",
    },
    image: {
      control: "text",
      description: "URL of the image to display",
    },
    imageAlt: {
      control: "text",
      description: "Alt text for the image",
    },
    imagePosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the image in the card",
    },
    interactive: {
      control: "boolean",
      description: "Whether the card should have hover effects",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the card",
    },
    headerClassName: {
      control: "text",
      description: "Additional CSS classes for the header",
    },
    contentClassName: {
      control: "text",
      description: "Additional CSS classes for the content",
    },
    footerClassName: {
      control: "text",
      description: "Additional CSS classes for the footer",
    },
    imageClassName: {
      control: "text",
      description: "Additional CSS classes for the image",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Sample image URL that works consistently
const sampleImage =
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

// Basic Card with all text props
export const Default: Story = {
  args: {
    title: "Card Title",
    subtitle: "Card Subtitle or Description",
    content:
      "This is the main content of the card. It can contain any text or React components.",
    actions: <Button size="sm">View Details</Button>,
  },
};

// Card with image at the top
export const WithTopImage: Story = {
  args: {
    title: "Card with Top Image",
    subtitle: "Image positioned at the top",
    content:
      "This card has an image at the top, which is the default position. Notice the reduced padding at the top.",
    actions: <Button size="sm">Learn More</Button>,
    image: sampleImage,
    imagePosition: "top",
  },
};

// Card with image at the bottom
export const WithBottomImage: Story = {
  args: {
    title: "Card with Bottom Image",
    subtitle: "Image positioned at the bottom",
    content:
      "This card has an image at the bottom. Notice the reduced padding at the bottom.",
    actions: <Button size="sm">View Details</Button>,
    image: sampleImage,
    imagePosition: "bottom",
  },
};

// Card with image on the left (horizontal layout)
export const WithLeftImage: Story = {
  args: {
    title: "Card with Left Image",
    subtitle: "Image positioned on the left",
    content:
      "This card has an image on the left side, creating a horizontal layout. Notice the proper padding and rounded corners.",
    actions: <Button size="sm">Explore</Button>,
    image: sampleImage,
    imagePosition: "left",
  },
};

// Card with image on the right (horizontal layout)
export const WithRightImage: Story = {
  args: {
    title: "Card with Right Image",
    subtitle: "Image positioned on the right",
    content:
      "This card has an image on the right side, creating a horizontal layout.",
    actions: <Button size="sm">Details</Button>,
    image: sampleImage,
    imagePosition: "right",
  },
};

// Card with left image and multiple action buttons
export const WithLeftImageAndActions: Story = {
  args: {
    title: "Card with Left Image and Actions",
    subtitle: "Image on the left with action buttons",
    content:
      "This card has an image on the left side and multiple action buttons. It demonstrates how horizontal layout works with actions.",
    image: sampleImage,
    imagePosition: "left",
    actions: (
      <>
        <Button variant="outline" size="sm">
          Decline
        </Button>
        <Button size="sm">Accept</Button>
      </>
    ),
  },
};

// Interactive Card with hover effects
export const InteractiveCard: Story = {
  args: {
    title: "Interactive Card",
    subtitle: "This card has hover effects",
    content:
      "Hover over this card to see the interactive effects. The card will lift slightly and show a shadow.",
    actions: <Button size="sm">Click Me</Button>,
    interactive: true,
    image: sampleImage,
    imagePosition: "top",
  },
};

// Card with multiple action buttons
export const WithMultipleActions: Story = {
  args: {
    title: "Card with Multiple Actions",
    subtitle: "This card has multiple action buttons",
    content:
      "This example shows how to add multiple action buttons to the card.",
    actions: (
      <>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button size="sm">Save</Button>
      </>
    ),
    image: sampleImage,
    imagePosition: "top",
  },
};

// Card with custom styling
export const CustomStyling: Story = {
  args: {
    title: "Custom Styled Card",
    subtitle: "With custom colors and styling",
    content:
      "This card demonstrates how to apply custom styling to different parts of the card.",
    actions: (
      <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
        Custom Button
      </Button>
    ),
    className: "bg-blue-50 border-blue-200",
    headerClassName: "bg-blue-100 text-blue-800",
    contentClassName: "text-blue-700",
    footerClassName: "bg-blue-100 border-t border-blue-200",
    image: sampleImage,
    imagePosition: "top",
    imageClassName: "opacity-90",
  },
};

// Card with rich content (React components)
export const RichContent: Story = {
  args: {
    title: "Rich Content Card",
    subtitle: "With React components as content",
    content: (
      <div className="space-y-4">
        <p>This card contains rich content with React components.</p>
        <div className="rounded-md bg-muted p-3">
          <h4 className="text-sm font-medium mb-1">Feature highlight</h4>
          <p className="text-xs text-muted-foreground">
            You can include any React components in the content.
          </p>
        </div>
      </div>
    ),
    actions: <Button variant="outline">View Details</Button>,
    image: sampleImage,
    imagePosition: "top",
  },
};

// Minimal Card (only content)
export const MinimalCard: Story = {
  args: {
    content:
      "This is a minimal card with only content and no header, footer, or actions.",
  },
};

// Card with only image and title
export const ImageAndTitle: Story = {
  args: {
    title: "Image Card",
    image: sampleImage,
    imagePosition: "top",
    actions: <Button size="sm">View</Button>,
  },
};

// Card with custom image aspect ratio
export const CustomImageAspectRatio: Story = {
  args: {
    title: "Custom Image Aspect Ratio",
    subtitle: "With custom image styling",
    content: "This card has a custom image aspect ratio.",
    image: sampleImage,
    imagePosition: "top",
    imageClassName: "aspect-square", // 1:1 aspect ratio
    actions: <Button size="sm">Details</Button>,
  },
};

// Card with full-width image
export const FullWidthImage: Story = {
  args: {
    title: "Full-width Image Card",
    subtitle: "Image takes full width",
    content: "This card has a full-width image at the top.",
    actions: <Button size="sm">Learn More</Button>,
    image: sampleImage,
    imagePosition: "top",
    className: "max-w-xl", // Wider card
  },
};

// Comparison of cards with and without images
export const ComparisonWithWithoutImage: Story = {
  render: () => (
    <div className="flex flex-col md:flex-row gap-4">
      <Card
        title="Card Without Image"
        subtitle="Standard padding"
        content="This card has no image, so it uses the standard padding."
        actions={<Button size="sm">Action</Button>}
      />
      <Card
        title="Card With Top Image"
        subtitle="Adjusted padding"
        content="This card has an image at the top, so the top padding is adjusted."
        actions={<Button size="sm">Action</Button>}
        image={sampleImage}
        imagePosition="top"
      />
    </div>
  ),
};
