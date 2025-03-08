import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ServicesList } from "../components/composed/services-list";

const meta: Meta<typeof ServicesList> = {
  title: "Composed/ServicesList",
  component: ServicesList,
  tags: ["autodocs"],
  argTypes: {
    heading: {
      control: "text",
      description: "Heading for the services list",
    },
    subheading: {
      control: "text",
      description: "Subheading or description for the services list",
    },
    items: {
      control: "object",
      description: `Array of service items to display. Each item can have the following properties:
- \`title\` (string, required): The title of the service or feature
- \`description\` (string, required): Description text for the service
- \`icon\` (React.ReactNode, optional): Icon component to display
- \`link\` (string, optional): URL for the "Learn more" link
- \`linkText\` (string, optional): Custom text for the link (defaults to "Learn more")
- \`accentColor\` (string, optional): Custom color for the item (e.g., "#3b82f6" for blue)`,
    },
    columns: {
      control: { type: "select", options: [1, 2, 3, 4] },
      description: "Number of columns to display",
    },
    layout: {
      control: { type: "radio", options: ["grid", "list", "cards"] },
      description: "Layout style: 'grid', 'list', or 'cards'",
    },
    variant: {
      control: { type: "radio", options: ["minimal", "bordered", "elevated"] },
      description: "Visual style: 'minimal', 'bordered', or 'elevated'",
    },
    headingStyle: {
      control: {
        type: "radio",
        options: ["default", "gradient", "underline", "boxed"],
      },
      description:
        "Heading style: 'default', 'gradient', 'underline', or 'boxed'",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the text in each item",
    },
    interactive: {
      control: "boolean",
      description: "Whether to add hover effects to items",
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
# ServicesList Component

A flexible component for displaying a list of services, features, or offerings.

## Item Structure

Each item in the \`items\` array can have the following properties:

\`\`\`typescript
{
  title: string;           // Required: Title of the service
  description: string;     // Required: Description text
  icon?: React.ReactNode;  // Optional: Icon component
  link?: string;           // Optional: URL for "Learn more" link
  linkText?: string;       // Optional: Custom text for the link
  accentColor?: string;    // Optional: Custom color (e.g., "#3b82f6")
}
\`\`\`

## Example Usage

\`\`\`jsx
<ServicesList
  heading="Our Services"
  subheading="We offer a range of services to help your business grow"
  items={[
    {
      title: "Secure Payments",
      description: "Our payment processing is secure and compliant with industry standards.",
      icon: <PaymentIcon />,
      link: "/payments",
      linkText: "Learn more",
      accentColor: "#3b82f6"
    },
    // More items...
  ]}
  columns={3}
  layout="cards"
  variant="elevated"
  interactive={true}
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServicesList>;

// Sample icons with improved styling
const IconOne = () => (
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
    className="text-primary"
  >
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTwo = () => (
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
    className="text-primary"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);

const IconThree = () => (
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
    className="text-primary"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const IconFour = () => (
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
    className="text-primary"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

// Sample items with improved descriptions
const sampleItems = [
  {
    title: "Secure Payments",
    description:
      "Our payment processing is secure and compliant with the highest industry standards, ensuring your financial data is always protected.",
    icon: <IconOne />,
    link: "#",
    linkText: "Payment Options",
  },
  {
    title: "Subscription Management",
    description:
      "Easily manage your subscriptions with our intuitive dashboard and controls. Update, pause, or cancel at any time with just a few clicks.",
    icon: <IconTwo />,
    link: "#",
    linkText: "Learn More",
  },
  {
    title: "Instant Notifications",
    description:
      "Get real-time notifications for all account activities and transactions. Stay informed about important updates wherever you are.",
    icon: <IconThree />,
    link: "#",
  },
];

// Default grid layout with 3 columns and elevated style
export const Default: Story = {
  args: {
    heading: "Our Services",
    subheading:
      "We offer a range of services to help your business grow and succeed in today's competitive market",
    items: sampleItems,
    columns: 3,
    layout: "grid",
    variant: "elevated",
    interactive: true,
    headingStyle: "gradient",
  },
};

// Cards layout with accent colors
export const CardsLayout: Story = {
  args: {
    heading: "Featured Services",
    subheading:
      "Discover what makes our platform stand out from the competition",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
    ],
    columns: 3,
    layout: "cards",
    variant: "elevated",
    interactive: true,
    headingStyle: "underline",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates the 'cards' layout with accent colors applied to each item.",
      },
    },
  },
};

// List layout with bordered style and accent colors
export const ListLayout: Story = {
  args: {
    heading: "Featured Services",
    subheading: "Discover what makes our platform stand out",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
    ],
    layout: "list",
    variant: "bordered",
    headingStyle: "boxed",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The 'list' layout stacks items vertically. When combined with the 'bordered' variant and accent colors, each item gets a colored left border.",
      },
    },
  },
};

// Centered items with minimal style
export const CenteredItems: Story = {
  args: {
    heading: "What We Offer",
    subheading: "Comprehensive solutions for modern businesses",
    items: sampleItems,
    columns: 3,
    centered: true,
    variant: "minimal",
    interactive: true,
    headingStyle: "gradient",
  },
};

// Two columns layout with bordered style and accent colors
export const TwoColumns: Story = {
  args: {
    heading: "Key Features",
    subheading: "Powerful features to enhance your workflow",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
    ],
    columns: 2,
    variant: "bordered",
    headingStyle: "underline",
  },
};

// Four columns layout with elevated style
export const FourColumns: Story = {
  args: {
    heading: "Platform Benefits",
    subheading: "Why choose our platform for your business needs",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
      {
        title: "24/7 Support",
        description:
          "Our dedicated support team is available around the clock to assist you with any questions or issues you might encounter.",
        icon: <IconFour />,
        link: "#",
        linkText: "Contact Support",
        accentColor: "#8b5cf6", // violet-500
      },
    ],
    columns: 4,
    variant: "elevated",
    interactive: true,
    headingStyle: "boxed",
  },
};

// Different heading styles showcase
export const HeadingStyles: Story = {
  render: () => (
    <div className="space-y-32">
      <ServicesList
        heading="Default Heading Style"
        subheading="This is the default heading style with no special formatting"
        items={sampleItems}
        columns={3}
        headingStyle="default"
      />

      <ServicesList
        heading="Gradient Heading Style"
        subheading="This heading uses a beautiful gradient effect that draws attention"
        items={sampleItems}
        columns={3}
        headingStyle="gradient"
      />

      <ServicesList
        heading="Underline Heading Style"
        subheading="This heading has an underline accent that adds a subtle touch"
        items={sampleItems}
        columns={3}
        headingStyle="underline"
      />

      <ServicesList
        heading="Boxed Heading Style"
        subheading="This heading is contained in a box that makes it stand out"
        items={sampleItems}
        columns={3}
        headingStyle="boxed"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This example showcases the four different heading styles available: default, gradient, underline, and boxed.",
      },
    },
  },
};

// Without icons, bordered style
export const WithoutIcons: Story = {
  args: {
    heading: "Available Services",
    subheading: "Simple and effective solutions for your needs",
    items: sampleItems.map(({ icon, ...item }) => item), // Remove icons
    columns: 3,
    variant: "bordered",
    headingStyle: "gradient",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Items can be displayed without icons by omitting the `icon` property from each item.",
      },
    },
  },
};

// Without links, minimal style
export const WithoutLinks: Story = {
  args: {
    heading: "Core Offerings",
    subheading: "The foundation of our service platform",
    items: sampleItems.map(({ link, linkText, ...item }) => item), // Remove links
    columns: 3,
    variant: "minimal",
    headingStyle: "underline",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Items can be displayed without links by omitting the `link` and `linkText` properties from each item.",
      },
    },
  },
};

// Cards layout with custom styling
export const CustomStyling: Story = {
  args: {
    heading: "Premium Services",
    subheading: "Exclusive offerings for our valued customers",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
    ],
    columns: 3,
    layout: "cards",
    className: "bg-slate-50 p-8 rounded-xl",
    itemClassName: "bg-white shadow-sm border border-slate-100",
    interactive: true,
    headingStyle: "boxed",
  },
  parameters: {
    docs: {
      description: {
        story:
          "You can apply custom styling to the container and items using the `className` and `itemClassName` props.",
      },
    },
  },
};

// Minimal version (no heading, no subheading)
export const Minimal: Story = {
  args: {
    items: sampleItems,
    columns: 3,
    variant: "elevated",
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The component can be used without a heading and subheading, displaying only the service items.",
      },
    },
  },
};

// Many items with cards layout and accent colors
export const ManyItems: Story = {
  args: {
    heading: "Complete Service Catalog",
    subheading: "Browse our extensive range of services and solutions",
    items: [
      {
        ...sampleItems[0],
        accentColor: "#3b82f6", // blue-500
      },
      {
        ...sampleItems[1],
        accentColor: "#10b981", // emerald-500
      },
      {
        ...sampleItems[2],
        accentColor: "#f59e0b", // amber-500
      },
      {
        title: "Data Analytics",
        description:
          "Gain insights from your data with advanced analytics tools and visualizations that help you make informed business decisions.",
        icon: <IconTwo />,
        accentColor: "#8b5cf6", // violet-500
      },
      {
        title: "Cloud Storage",
        description:
          "Secure and scalable storage solutions for your business with automatic backups and easy file sharing capabilities.",
        icon: <IconThree />,
        accentColor: "#ec4899", // pink-500
      },
      {
        title: "API Integration",
        description:
          "Seamlessly connect with third-party services and platforms to extend functionality and automate your workflows.",
        icon: <IconOne />,
        accentColor: "#14b8a6", // teal-500
      },
    ],
    columns: 3,
    layout: "cards",
    variant: "elevated",
    interactive: true,
    headingStyle: "gradient",
    centered: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The component can handle many items, automatically arranging them in a responsive grid based on the `columns` prop.",
      },
    },
  },
};
