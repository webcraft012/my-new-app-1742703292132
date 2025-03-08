import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "../components/composed/profile-card";

const meta: Meta<typeof ProfileCard> = {
  title: "Composed/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User's name",
    },
    role: {
      control: "text",
      description: "User's role or title",
    },
    imageUrl: {
      control: "text",
      description: "URL for the user's profile image",
    },
    initials: {
      control: "text",
      description:
        "User's initials (used as fallback when image is not available)",
    },
    bio: {
      control: "text",
      description: "Short bio or description",
    },
    skills: {
      control: "object",
      description: "Array of skills or tags to display",
    },
    primaryActionText: {
      control: "text",
      description: "Primary action button text",
    },
    secondaryActionText: {
      control: "text",
      description: "Secondary action button text",
    },
    onPrimaryActionClick: {
      action: "primaryActionClicked",
      description: "Handler for primary action button click",
    },
    onSecondaryActionClick: {
      action: "secondaryActionClicked",
      description: "Handler for secondary action button click",
    },
    interactive: {
      control: "boolean",
      description: "Whether the card should have hover effects",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

// Sample image URL that works consistently
const sampleImage =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

// Basic profile card
export const Default: Story = {
  args: {
    name: "John Doe",
    role: "Software Engineer",
    imageUrl: sampleImage,
    bio: "Full-stack developer with 5 years of experience in building web applications.",
    skills: ["React", "TypeScript", "Node.js"],
    primaryActionText: "View Profile",
    secondaryActionText: "Message",
  },
};

// Profile card without image
export const WithoutImage: Story = {
  args: {
    name: "Alex Johnson",
    role: "Product Designer",
    bio: "Passionate about creating intuitive user experiences and beautiful interfaces.",
    skills: ["UI/UX", "Figma", "Design Systems"],
    primaryActionText: "View Portfolio",
  },
};

// Profile card with many skills
export const WithManySkills: Story = {
  args: {
    name: "Sarah Williams",
    role: "Senior Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Full-stack developer specializing in scalable cloud applications.",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "AWS",
      "Docker",
      "Kubernetes",
      "GraphQL",
      "MongoDB",
      "Redis",
    ],
    primaryActionText: "Connect",
    secondaryActionText: "View CV",
  },
};

// Interactive profile card
export const Interactive: Story = {
  args: {
    name: "Michael Chen",
    role: "Frontend Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Creating beautiful and performant user interfaces with modern web technologies.",
    skills: ["React", "CSS", "Animation"],
    primaryActionText: "View Profile",
    interactive: true,
  },
};

// Minimal profile card
export const Minimal: Story = {
  args: {
    name: "Emma Wilson",
    role: "UX Researcher",
    primaryActionText: "Contact",
  },
};

// Custom styled profile card
export const CustomStyling: Story = {
  args: {
    name: "David Miller",
    role: "DevOps Engineer",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Automating infrastructure and deployment pipelines for seamless software delivery.",
    skills: ["AWS", "Terraform", "CI/CD"],
    primaryActionText: "Hire Me",
    secondaryActionText: "Learn More",
    className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
  },
};

// Multiple profile cards comparison
export const Comparison: Story = {
  render: () => (
    <div className="flex flex-col md:flex-row gap-4">
      <ProfileCard
        name="John Doe"
        role="Software Engineer"
        imageUrl={sampleImage}
        skills={["React", "TypeScript"]}
        primaryActionText="View Profile"
      />
      <ProfileCard
        name="Jane Smith"
        role="Product Designer"
        imageUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        skills={["UI/UX", "Figma"]}
        primaryActionText="View Portfolio"
        secondaryActionText="Contact"
      />
    </div>
  ),
};
