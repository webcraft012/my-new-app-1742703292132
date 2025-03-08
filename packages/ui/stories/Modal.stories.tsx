import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalBody, ModalFooter } from "../components/composed/modal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Check, Info, AlertTriangle, X } from "lucide-react";

const meta: Meta<typeof Modal> = {
  title: "Composed/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A versatile modal component that can be used to display content in a dialog.
It builds on top of the Dialog component from Radix UI, providing a more streamlined interface for common use cases.

## Features
- Multiple size options (sm, md, lg, xl, full)
- Position control (center, top)
- Optional title and close button
- Customizable overlay
- Control for closing behavior (click outside, escape key)
- Scroll prevention
- Fully customizable styling
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "The size of the modal",
      defaultValue: "md",
    },
    position: {
      control: "radio",
      options: ["center", "top"],
      description: "The position of the modal",
      defaultValue: "center",
    },
    title: {
      control: "text",
      description: "The title of the modal",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
      defaultValue: true,
    },
    closeOnClickOutside: {
      control: "boolean",
      description: "Whether to close the modal when clicking outside",
      defaultValue: true,
    },
    closeOnEscape: {
      control: "boolean",
      description: "Whether to close the modal when pressing escape",
      defaultValue: true,
    },
    preventScroll: {
      control: "boolean",
      description: "Whether to prevent scrolling when the modal is open",
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic modal with simple content
export const Default: Story = {
  args: {
    title: "Basic Modal",
    trigger: <Button>Open Modal</Button>,
    children: (
      <ModalBody>
        <p>This is a basic modal with simple content.</p>
      </ModalBody>
    ),
  },
};

// Small modal with form
export const SmallForm: Story = {
  args: {
    title: "Subscribe to Newsletter",
    size: "sm",
    trigger: <Button variant="outline">Subscribe</Button>,
    children: (
      <>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive our newsletter with the latest
              updates.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="your.email@example.com" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Subscribe</Button>
        </ModalFooter>
      </>
    ),
  },
};

// Large modal with form
export const LargeForm: Story = {
  args: {
    title: "Contact Us",
    size: "lg",
    trigger: <Button>Contact Us</Button>,
    children: (
      <>
        <ModalBody>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea id="message" className="col-span-3" rows={5} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Send Message</Button>
        </ModalFooter>
      </>
    ),
  },
};

// Alert modal
export const AlertModal: Story = {
  args: {
    size: "sm",
    showCloseButton: false,
    trigger: <Button variant="destructive">Delete Item</Button>,
    children: (
      <>
        <ModalBody className="text-center p-6">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Delete Item</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-center border-t-0 pb-6">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </>
    ),
  },
};

// Success modal
export const SuccessModal: Story = {
  args: {
    size: "sm",
    showCloseButton: false,
    trigger: <Button variant="outline">Complete Action</Button>,
    children: (
      <>
        <ModalBody className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Success!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your action has been completed successfully.
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-center border-t-0 pb-6">
          <Button>Continue</Button>
        </ModalFooter>
      </>
    ),
  },
};

// Info modal
export const InfoModal: Story = {
  args: {
    title: "Information",
    size: "md",
    trigger: <Button variant="outline">Learn More</Button>,
    children: (
      <ModalBody>
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-2">
              This is an informational modal that provides additional context or
              help.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can use this type of modal to explain features, provide help
              text, or display any other informational content that doesn't
              require user action.
            </p>
          </div>
        </div>
      </ModalBody>
    ),
  },
};

// Full screen modal
export const FullScreenModal: Story = {
  args: {
    title: "Full Screen Modal",
    size: "full",
    trigger: <Button>Open Full Screen</Button>,
    children: (
      <ModalBody className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to the Full Experience
        </h2>
        <p className="text-center max-w-md mb-6">
          This modal takes up most of the screen, making it perfect for
          immersive content, detailed forms, or complex interfaces that need
          more space.
        </p>
        <Button>Get Started</Button>
      </ModalBody>
    ),
  },
};

// Modal with custom styling
export const CustomStyling: Story = {
  args: {
    trigger: <Button variant="outline">Custom Modal</Button>,
    className:
      "bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none rounded-xl",
    overlayClassName: "bg-purple-900/40 backdrop-blur-md",
    children: (
      <ModalBody className="p-6">
        <h3 className="text-xl font-bold mb-4">Custom Styled Modal</h3>
        <p className="mb-4">
          This modal has custom styling applied to both the modal itself and the
          overlay.
        </p>
        <div className="flex justify-end">
          <Button className="bg-white text-purple-700 hover:bg-white/90">
            Close
          </Button>
        </div>
      </ModalBody>
    ),
  },
};

// Controlled modal example
export const ControlledModal: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
        <div className="text-sm text-gray-500">
          Modal is {open ? "open" : "closed"}
        </div>

        <Modal open={open} onOpenChange={setOpen} title="Controlled Modal">
          <ModalBody>
            <p>This modal is controlled externally through React state.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
};
