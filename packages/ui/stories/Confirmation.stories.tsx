import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Confirmation } from "../components/composed/confirmation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";

const meta: Meta<typeof Confirmation> = {
  title: "Composed/Confirmation",
  component: Confirmation,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A specialized modal component for confirming actions like bookings, deletions, or other important operations.
It provides visual cues through icons and colors to indicate the type of confirmation.

## Features
- Multiple confirmation types (success, warning, danger, info, loading)
- Customizable messages and buttons
- Loading states for async operations
- Optional cancel button
- Support for additional content
- Fully customizable styling
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["success", "warning", "danger", "info", "loading"],
      description: "The type of confirmation",
      defaultValue: "info",
    },
    title: {
      control: "text",
      description: "The title of the confirmation",
    },
    message: {
      control: "text",
      description: "The main message or description",
    },
    confirmText: {
      control: "text",
      description: "The text for the confirm button",
      defaultValue: "Confirm",
    },
    cancelText: {
      control: "text",
      description: "The text for the cancel button",
      defaultValue: "Cancel",
    },
    showCancel: {
      control: "boolean",
      description: "Whether to show the cancel button",
      defaultValue: true,
    },
    closeOnConfirm: {
      control: "boolean",
      description:
        "Whether to close the confirmation when the confirm button is clicked",
      defaultValue: true,
    },
    closeOnCancel: {
      control: "boolean",
      description:
        "Whether to close the confirmation when the cancel button is clicked",
      defaultValue: true,
    },
    isConfirmLoading: {
      control: "boolean",
      description: "Whether the confirm button is in a loading state",
      defaultValue: false,
    },
    isConfirmDisabled: {
      control: "boolean",
      description: "Whether the confirm button is disabled",
      defaultValue: false,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the confirmation modal",
      defaultValue: "sm",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Confirmation>;

// Basic info confirmation
export const Info: Story = {
  args: {
    title: "Confirm Booking",
    message:
      "Are you sure you want to book this appointment for July 15, 2023 at 10:00 AM?",
    type: "info",
    trigger: <Button>Book Appointment</Button>,
  },
};

// Success confirmation
export const Success: Story = {
  args: {
    title: "Booking Confirmed",
    message:
      "Your appointment has been successfully booked for July 15, 2023 at 10:00 AM.",
    type: "success",
    confirmText: "View Details",
    cancelText: "Close",
    trigger: <Button variant="outline">Show Success</Button>,
  },
};

// Warning confirmation
export const Warning: Story = {
  args: {
    title: "Reschedule Appointment",
    message:
      "You're about to reschedule your appointment. This may result in limited time slot availability.",
    type: "warning",
    confirmText: "Reschedule",
    trigger: <Button variant="secondary">Reschedule</Button>,
  },
};

// Danger confirmation
export const Danger: Story = {
  args: {
    title: "Cancel Appointment",
    message:
      "Are you sure you want to cancel your appointment? This action cannot be undone.",
    type: "danger",
    confirmText: "Cancel Appointment",
    trigger: <Button variant="destructive">Cancel Appointment</Button>,
  },
};

// Loading confirmation
export const Loading: Story = {
  args: {
    title: "Processing Payment",
    message:
      "Please wait while we process your payment. This may take a few moments.",
    type: "loading",
    showCancel: false,
    confirmText: "Processing...",
    isConfirmDisabled: true,
    trigger: <Button>Make Payment</Button>,
  },
};

// Confirmation with additional content
export const WithAdditionalContent: Story = {
  args: {
    title: "Confirm Subscription",
    message: "You're about to subscribe to our Premium plan at $19.99/month.",
    type: "info",
    confirmText: "Subscribe",
    size: "md",
    trigger: <Button>Subscribe</Button>,
    children: (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-left">
        <h4 className="font-medium text-sm mb-2">Premium Plan Includes:</h4>
        <ul className="text-xs space-y-1 list-disc pl-4">
          <li>Unlimited access to all features</li>
          <li>Priority customer support</li>
          <li>Advanced analytics</li>
          <li>Custom integrations</li>
        </ul>
      </div>
    ),
  },
};

// Confirmation with form
export const WithForm: Story = {
  args: {
    title: "Delete Account",
    message: "To confirm account deletion, please type your password below.",
    type: "danger",
    confirmText: "Delete Account",
    size: "md",
    trigger: <Button variant="destructive">Delete Account</Button>,
    children: (
      <div className="w-full max-w-xs mx-auto mb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-left block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="confirm" />
            <Label htmlFor="confirm" className="text-xs">
              I understand this action cannot be undone
            </Label>
          </div>
        </div>
      </div>
    ),
  },
};

// Controlled confirmation example
export const ControlledConfirmation: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleConfirm = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 2000);
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={() => {
            setIsSuccess(false);
            setOpen(true);
          }}
        >
          Open Controlled Confirmation
        </Button>

        <Confirmation
          open={open}
          onOpenChange={setOpen}
          title={isSuccess ? "Payment Successful" : "Confirm Payment"}
          message={
            isSuccess
              ? "Your payment of $99.99 has been processed successfully."
              : "You're about to make a payment of $99.99. Proceed?"
          }
          type={isSuccess ? "success" : "info"}
          confirmText={isSuccess ? "View Receipt" : "Pay Now"}
          cancelText={isSuccess ? "Close" : "Cancel"}
          onConfirm={isSuccess ? undefined : handleConfirm}
          isConfirmLoading={isLoading}
          closeOnConfirm={isSuccess}
        />
      </div>
    );
  },
};
