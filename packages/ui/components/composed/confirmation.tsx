"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Modal, ModalBody, ModalFooter } from "./modal";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

export type ConfirmationType =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "loading";

export interface ConfirmationProps {
  /** Whether the confirmation is open */
  open?: boolean;
  /** Callback when the confirmation open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The title of the confirmation */
  title: React.ReactNode;
  /** The main message or description */
  message: React.ReactNode;
  /** The type of confirmation */
  type?: ConfirmationType;
  /** The text for the confirm button */
  confirmText?: string;
  /** The text for the cancel button */
  cancelText?: string;
  /** Handler for confirm button click */
  onConfirm?: () => void;
  /** Handler for cancel button click */
  onCancel?: () => void;
  /** Whether to show the cancel button */
  showCancel?: boolean;
  /** Whether to close the confirmation when the confirm button is clicked */
  closeOnConfirm?: boolean;
  /** Whether to close the confirmation when the cancel button is clicked */
  closeOnCancel?: boolean;
  /** Additional content to render below the message */
  children?: React.ReactNode;
  /** The trigger element that opens the confirmation */
  trigger?: React.ReactNode;
  /** Additional CSS classes for the confirmation */
  className?: string;
  /** Whether the confirm button is in a loading state */
  isConfirmLoading?: boolean;
  /** Whether the confirm button is disabled */
  isConfirmDisabled?: boolean;
  /** Additional CSS classes for the icon */
  iconClassName?: string;
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Size of the confirmation modal */
  size?: "sm" | "md" | "lg";
}

const typeConfig: Record<
  ConfirmationType,
  {
    icon: React.ReactNode;
    confirmVariant: "default" | "destructive" | "outline" | "secondary";
    iconClassName: string;
  }
> = {
  success: {
    icon: <CheckCircle2 className="h-10 w-10" />,
    confirmVariant: "default",
    iconClassName: "text-green-500 dark:text-green-400",
  },
  warning: {
    icon: <AlertTriangle className="h-10 w-10" />,
    confirmVariant: "default",
    iconClassName: "text-amber-500 dark:text-amber-400",
  },
  danger: {
    icon: <AlertCircle className="h-10 w-10" />,
    confirmVariant: "destructive",
    iconClassName: "text-red-500 dark:text-red-400",
  },
  info: {
    icon: <Info className="h-10 w-10" />,
    confirmVariant: "default",
    iconClassName: "text-blue-500 dark:text-blue-400",
  },
  loading: {
    icon: <Loader2 className="h-10 w-10 animate-spin" />,
    confirmVariant: "default",
    iconClassName: "text-gray-500 dark:text-gray-400",
  },
};

/**
 * A confirmation component for confirming actions like bookings, deletions, etc.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Confirmation
 *   title="Confirm Booking"
 *   message="Are you sure you want to book this appointment?"
 *   type="info"
 *   onConfirm={() => handleBooking()}
 *   trigger={<Button>Book Appointment</Button>}
 * />
 *
 * // Danger confirmation
 * <Confirmation
 *   title="Delete Account"
 *   message="This action cannot be undone. All your data will be permanently deleted."
 *   type="danger"
 *   confirmText="Delete Account"
 *   onConfirm={() => handleDeleteAccount()}
 *   trigger={<Button variant="destructive">Delete Account</Button>}
 * />
 * ```
 */
export function Confirmation({
  open,
  onOpenChange,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancel = true,
  closeOnConfirm = true,
  closeOnCancel = true,
  children,
  trigger,
  className,
  isConfirmLoading = false,
  isConfirmDisabled = false,
  iconClassName,
  icon,
  size = "sm",
}: ConfirmationProps) {
  const config = typeConfig[type];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    if (closeOnConfirm && onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }

    if (closeOnCancel && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      size={size}
      className={cn("text-center", className)}
    >
      <ModalBody className="pt-6 px-6">
        <div className="flex flex-col items-center">
          <div className={cn("mb-4", config.iconClassName, iconClassName)}>
            {icon || config.icon}
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>

          {children && <div className="mt-2 mb-4">{children}</div>}
        </div>
      </ModalBody>

      <ModalFooter className="flex justify-center border-t-0 pb-6 px-6 gap-3">
        {showCancel && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
        )}

        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
          className="min-w-[100px] font-medium"
        >
          {isConfirmLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {confirmText}
            </>
          ) : (
            confirmText
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
