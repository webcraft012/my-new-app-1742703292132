import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  PortfolioGrid,
  PortfolioItem,
} from "../components/composed/portfolio-grid";

const meta: Meta<typeof PortfolioGrid> = {
  title: "Composed/PortfolioGrid",
  component: PortfolioGrid,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: `Array of portfolio items to display. Each item can have the following properties:
- \`imageUrl\` (string, required): URL of the image to display
- \`imageAlt\` (string, required): Alt text for the image
- \`title\` (string, required): Title of the portfolio item
- \`description\` (string, optional): Description or caption
- \`category\` (string, optional): Category or tag for filtering
- \`link\` (string, optional): URL to navigate to when clicked
- \`aspectRatio\` (string, optional): Predefined aspect ratio ('square', 'portrait', 'landscape', 'wide', 'custom')
- \`customAspectRatio\` (string, optional): Custom aspect ratio (e.g., '16/9') - only used when aspectRatio is 'custom'
- \`metadata\` (object, optional): Additional metadata like date, location, camera settings`,
    },
    columns: {
      control: { type: "select", options: [1, 2, 3, 4] },
      description: "Number of columns in the grid",
    },
    gap: {
      control: { type: "radio", options: ["none", "small", "medium", "large"] },
      description: "Gap between grid items",
    },
    layout: {
      control: { type: "radio", options: ["grid", "masonry"] },
      description: "Layout style: 'grid' or 'masonry'",
    },
    detailsDisplay: {
      control: {
        type: "radio",
        options: ["hover", "always", "overlay", "below"],
      },
      description:
        "How to display item details: 'hover', 'always', 'overlay', or 'below'",
    },
    hoverEffect: {
      control: {
        type: "radio",
        options: ["zoom", "lift", "glow", "fade", "none"],
      },
      description:
        "Animation style for item hover: 'zoom', 'lift', 'glow', 'fade', or 'none'",
    },
    filterAnimation: {
      control: {
        type: "radio",
        options: ["fade", "scale", "slide", "none"],
      },
      description:
        "Animation style when filtering items: 'fade', 'scale', 'slide', or 'none'",
    },
    lightbox: {
      control: "boolean",
      description: "Whether to enable lightbox on click",
    },
    showFilters: {
      control: "boolean",
      description: "Whether to show category filters",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
    itemClassName: {
      control: "text",
      description: "Additional CSS classes for each item",
    },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# PortfolioGrid Component

A flexible component for displaying a grid of portfolio items, perfect for photography websites, design portfolios, or any image-based showcase.

## Item Structure

Each item in the \`items\` array can have the following properties:

\`\`\`typescript
{
  imageUrl: string;           // Required: URL of the image
  imageAlt: string;           // Required: Alt text for the image
  title: string;              // Required: Title of the portfolio item
  description?: string;       // Optional: Description or caption
  category?: string;          // Optional: Category or tag for filtering
  link?: string;              // Optional: URL to navigate to when clicked
  aspectRatio?: "square" | "portrait" | "landscape" | "wide" | "custom";
  customAspectRatio?: string; // Optional: Custom aspect ratio (e.g., "16/9")
  metadata?: {                // Optional: Additional metadata
    [key: string]: string;    // E.g., { "Date": "2023", "Location": "Paris" }
  };
}
\`\`\`

## Example Usage

\`\`\`jsx
<PortfolioGrid
  items={[
    {
      imageUrl: "/images/photo1.jpg",
      imageAlt: "Mountain landscape",
      title: "Mountain Vista",
      description: "Sunrise over the mountain range",
      category: "landscape",
      aspectRatio: "wide",
      metadata: { 
        "Date": "2023", 
        "Location": "Alps", 
        "Camera": "Sony A7IV" 
      }
    },
    // More items...
  ]}
  columns={3}
  layout="masonry"
  detailsDisplay="overlay"
  hoverEffect="zoom"
  showFilters={true}
  filterAnimation="fade"
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PortfolioGrid>;

// Sample portfolio items with correct aspectRatio types
const sampleItems: PortfolioItem[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Mountain landscape at sunset",
    title: "Mountain Sunset",
    description: "Breathtaking view of mountains during golden hour",
    category: "landscape",
    aspectRatio: "landscape",
    metadata: {
      Date: "2023",
      Location: "Rocky Mountains",
      Camera: "Sony A7IV",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Portrait of a woman in natural light",
    title: "Natural Light Portrait",
    description: "Portrait photography using only natural window light",
    category: "portrait",
    aspectRatio: "portrait",
    metadata: {
      Date: "2023",
      Location: "Studio",
      Lens: "85mm f/1.4",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Urban street photography",
    title: "City Rhythms",
    description: "Capturing the energy and movement of urban life",
    category: "street",
    aspectRatio: "square",
    metadata: {
      Date: "2022",
      Location: "New York",
      Camera: "Fujifilm X-T4",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Architectural detail of a modern building",
    title: "Modern Architecture",
    description: "Geometric patterns and lines in contemporary architecture",
    category: "architecture",
    aspectRatio: "wide",
    metadata: {
      Date: "2023",
      Location: "Barcelona",
      Lens: "24mm Tilt-Shift",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1455218873509-8097305ee378?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Minimalist landscape with a lone tree",
    title: "Solitude",
    description: "Minimalist composition exploring themes of isolation",
    category: "landscape",
    aspectRatio: "wide",
    metadata: {
      Date: "2022",
      Location: "Iceland",
      Camera: "Canon EOS R5",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    imageAlt: "Close-up portrait of a man",
    title: "Character Study",
    description: "Intimate portrait revealing personality and emotion",
    category: "portrait",
    aspectRatio: "portrait",
    metadata: {
      Date: "2023",
      Location: "Home Studio",
      Lighting: "Single Softbox",
    },
  },
];

// Default grid layout with 3 columns
export const Default: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "hover",
    hoverEffect: "zoom",
    showFilters: false,
  },
};

// Masonry layout with overlay details
export const MasonryLayout: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "masonry",
    detailsDisplay: "overlay",
    hoverEffect: "zoom",
    showFilters: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The masonry layout creates a Pinterest-like grid where items have different heights based on their content.",
      },
    },
  },
};

// Grid with category filters
export const WithFilters: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "hover",
    hoverEffect: "zoom",
    showFilters: true,
    filterAnimation: "fade",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example shows category filters that allow users to filter the portfolio items by category with a fade animation.",
      },
    },
  },
};

// Filter animations
export const FilterAnimations: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-xl font-bold mb-4">Fade Animation</h3>
        <PortfolioGrid
          items={sampleItems}
          columns={3}
          detailsDisplay="overlay"
          showFilters={true}
          filterAnimation="fade"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Scale Animation</h3>
        <PortfolioGrid
          items={sampleItems}
          columns={3}
          detailsDisplay="overlay"
          showFilters={true}
          filterAnimation="scale"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Slide Animation</h3>
        <PortfolioGrid
          items={sampleItems}
          columns={3}
          detailsDisplay="overlay"
          showFilters={true}
          filterAnimation="slide"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This example showcases the different filter animations available: fade, scale, and slide. Try clicking on different category filters to see the animations in action.",
      },
    },
  },
};

// Details displayed below images
export const DetailsBelow: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "below",
    hoverEffect: "none",
    showFilters: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "This layout displays item details below the images rather than as an overlay.",
      },
    },
  },
};

// Different hover effects
export const HoverEffects: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-xl font-bold mb-4">Zoom Effect</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 3)}
          columns={3}
          detailsDisplay="overlay"
          hoverEffect="zoom"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Lift Effect</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 3)}
          columns={3}
          detailsDisplay="overlay"
          hoverEffect="lift"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Glow Effect</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 3)}
          columns={3}
          detailsDisplay="overlay"
          hoverEffect="glow"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Fade Effect</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 3)}
          columns={3}
          detailsDisplay="overlay"
          hoverEffect="fade"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This example showcases the different hover effects available: zoom, lift, glow, and fade.",
      },
    },
  },
};

// Different column layouts
export const ColumnLayouts: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-xl font-bold mb-4">1 Column</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 3)}
          columns={1}
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">2 Columns</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 4)}
          columns={2}
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">3 Columns</h3>
        <PortfolioGrid
          items={sampleItems}
          columns={3}
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">4 Columns</h3>
        <PortfolioGrid
          items={sampleItems}
          columns={4}
          detailsDisplay="overlay"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how the grid looks with different numbers of columns.",
      },
    },
  },
};

// Different gap sizes
export const GapSizes: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-xl font-bold mb-4">No Gap</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 6)}
          columns={3}
          gap="none"
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Small Gap</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 6)}
          columns={3}
          gap="small"
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Medium Gap</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 6)}
          columns={3}
          gap="medium"
          detailsDisplay="overlay"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Large Gap</h3>
        <PortfolioGrid
          items={sampleItems.slice(0, 6)}
          columns={3}
          gap="large"
          detailsDisplay="overlay"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how the grid looks with different gap sizes between items.",
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "overlay",
    hoverEffect: "zoom",
    className: "bg-slate-100 p-8 rounded-xl",
    itemClassName: "shadow-md rounded-xl overflow-hidden",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how to apply custom styling to the container and items using the className and itemClassName props.",
      },
    },
  },
};

// Different aspect ratios
export const AspectRatios: Story = {
  args: {
    items: [
      {
        ...sampleItems[0],
        aspectRatio: "landscape",
        title: "Landscape Aspect Ratio (4:3)",
      },
      {
        ...sampleItems[1],
        aspectRatio: "portrait",
        title: "Portrait Aspect Ratio (3:4)",
      },
      {
        ...sampleItems[2],
        aspectRatio: "square",
        title: "Square Aspect Ratio (1:1)",
      },
      {
        ...sampleItems[3],
        aspectRatio: "wide",
        title: "Wide Aspect Ratio (16:9)",
      },
      {
        ...sampleItems[4],
        aspectRatio: "custom",
        customAspectRatio: "2/1",
        title: "Custom Aspect Ratio (2:1)",
      },
      {
        ...sampleItems[5],
        aspectRatio: "custom",
        customAspectRatio: "1/2",
        title: "Custom Aspect Ratio (1:2)",
      },
    ] as PortfolioItem[],
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "overlay",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example shows different aspect ratios for the images: landscape (4:3), portrait (3:4), square (1:1), wide (16:9), and custom ratios.",
      },
    },
  },
};

// Complete example with all features
export const CompleteExample: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    gap: "medium",
    layout: "grid",
    detailsDisplay: "overlay",
    hoverEffect: "zoom",
    showFilters: true,
    filterAnimation: "scale",
    className: "bg-slate-50 p-6 rounded-lg",
    itemClassName: "shadow-sm hover:shadow-md transition-shadow duration-300",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example combines multiple features: filtering with scale animation, overlay details, zoom hover effect, and custom styling.",
      },
    },
  },
};
