import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ItemCard } from "../components/composed/item-card";
import { Button } from "../components/ui/button";
import { ShoppingCart, Heart, Eye, Share2 } from "lucide-react";

const meta: Meta<typeof ItemCard> = {
  title: "Composed/ItemCard",
  component: ItemCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A versatile card component for displaying items with images, details, and actions. 
Perfect for e-commerce products, real estate listings, event tickets, menu items, and more.

## Features
- Image gallery with navigation arrows and indicators
- Support for sale prices and original prices
- Customizable badges (e.g., "Sale", "New", "Featured")
- Flexible action buttons
- Additional details display
- Multiple aspect ratio options
- Hover effects and image zoom
- Fully customizable styling
- Adjustable image height
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title of the item",
    },
    description: {
      control: "text",
      description: "Description of the item",
    },
    price: {
      control: "text",
      description: "Price of the item",
    },
    originalPrice: {
      control: "text",
      description: "Original/compare-at price (for sale items)",
    },
    currencySymbol: {
      control: "text",
      description: "Currency symbol to display before the price",
    },
    images: {
      control: "object",
      description: "Array of images for the item",
    },
    badge: {
      control: "text",
      description: "Badge text to display (e.g., 'Sale', 'New', 'Featured')",
    },
    badgeVariant: {
      control: {
        type: "select",
        options: ["default", "secondary", "destructive", "outline"],
      },
      description: "Badge variant/color",
    },
    primaryActionText: {
      control: "text",
      description: "Primary action button text",
    },
    secondaryActionText: {
      control: "text",
      description: "Secondary action button text",
    },
    showImageNavigation: {
      control: "boolean",
      description: "Whether to show image navigation arrows",
    },
    showImageIndicators: {
      control: "boolean",
      description: "Whether to show image indicators/dots",
    },
    interactive: {
      control: "boolean",
      description: "Whether the card should have hover effects",
    },
    imageAspectRatio: {
      control: {
        type: "select",
        options: ["square", "portrait", "landscape", "auto"],
      },
      description: "Aspect ratio for the images",
    },
    imageZoom: {
      control: "boolean",
      description: "Whether to enable image zoom on hover",
    },
    imageMaxHeight: {
      control: "text",
      description: "Maximum height for the image section",
    },
    details: {
      control: "object",
      description: "Additional details to display (key-value pairs)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ItemCard>;

// Sample images for stories
const sampleImages = [
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    alt: "Smart watch with black band",
  },
  {
    src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    alt: "Smart watch on wrist",
  },
  {
    src: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    alt: "Smart watch features",
  },
];

// Basic product card
export const Default: Story = {
  args: {
    title: "Smart Watch Pro",
    description:
      "Track your fitness goals, receive notifications, and more with this premium smart watch.",
    price: 199.99,
    images: sampleImages,
    primaryActionText: "Add to Cart",
    secondaryActionText: "View Details",
    interactive: true,
    imageMaxHeight: "180px",
  },
};

// Sale product with original price
export const SaleItem: Story = {
  args: {
    title: "Smart Watch Pro - Limited Edition",
    description:
      "Track your fitness goals, receive notifications, and more with this premium smart watch.",
    price: 149.99,
    originalPrice: 199.99,
    images: sampleImages,
    badge: "Sale",
    badgeVariant: "destructive",
    primaryActionText: "Add to Cart",
    secondaryActionText: "View Details",
    interactive: true,
    imageMaxHeight: "180px",
  },
};

// Product with additional details
export const WithDetails: Story = {
  args: {
    title: "Smart Watch Pro",
    description:
      "Track your fitness goals, receive notifications, and more with this premium smart watch.",
    price: 199.99,
    images: sampleImages,
    primaryActionText: "Add to Cart",
    secondaryActionText: "View Details",
    interactive: true,
    imageMaxHeight: "180px",
    details: {
      Battery: "Up to 5 days",
      "Water Resistant": "Yes (5 ATM)",
      Display: "AMOLED",
      Connectivity: "Bluetooth 5.0",
    },
  },
};

// Real estate listing example
export const RealEstateListing: Story = {
  args: {
    title: "Modern Apartment in Downtown",
    description:
      "Beautiful 2-bedroom apartment with stunning city views, modern amenities, and a prime location.",
    price: 450000,
    currencySymbol: "$",
    images: [
      {
        src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: "Modern apartment living room",
      },
      {
        src: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        alt: "Modern apartment kitchen",
      },
      {
        src: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: "Modern apartment bedroom",
      },
    ],
    imageAspectRatio: "landscape",
    imageMaxHeight: "150px",
    primaryActionText: "Schedule Viewing",
    secondaryActionText: "Contact Agent",
    interactive: true,
    details: {
      Bedrooms: "2",
      Bathrooms: "2",
      Area: "1,200 sq ft",
      "Year Built": "2020",
    },
    badge: "New Listing",
    badgeVariant: "default",
  },
};

// Restaurant menu item
export const MenuItemCard: Story = {
  args: {
    title: "Margherita Pizza",
    description:
      "Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
    price: 14.99,
    images: [
      {
        src: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: "Margherita Pizza",
      },
    ],
    imageAspectRatio: "landscape",
    imageMaxHeight: "120px",
    primaryActionText: "Order Now",
    details: {
      Calories: "850 kcal",
      Preparation: "15 min",
      Serves: "2 people",
      Vegetarian: "Yes",
    },
    badge: "Popular",
    badgeVariant: "secondary",
  },
};

// Custom actions example
export const CustomActions: Story = {
  args: {
    title: "Smart Watch Pro",
    description:
      "Track your fitness goals, receive notifications, and more with this premium smart watch.",
    price: 199.99,
    images: sampleImages,
    interactive: true,
    imageMaxHeight: "180px",
  },
  render: (args) => (
    <ItemCard
      {...args}
      renderActions={() => (
        <div className="flex gap-2 w-full">
          <Button className="flex-1" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  ),
};

// Image zoom effect
export const WithImageZoom: Story = {
  args: {
    ...Default.args,
    imageZoom: true,
  },
};

// Portrait aspect ratio
export const PortraitImages: Story = {
  args: {
    ...Default.args,
    imageAspectRatio: "portrait",
  },
};

// Different image heights
export const CompactImage: Story = {
  args: {
    ...Default.args,
    imageMaxHeight: "120px",
    title: "Compact Image Card",
  },
};

export const TallImage: Story = {
  args: {
    ...Default.args,
    imageMaxHeight: "250px",
    title: "Tall Image Card",
  },
};
