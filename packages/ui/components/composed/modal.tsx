"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export type ModalPosition = "center" | "top";

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when the modal open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The content of the modal */
  children: React.ReactNode;
  /** The trigger element that opens the modal */
  trigger?: React.ReactNode;
  /** The title of the modal */
  title?: React.ReactNode;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Additional CSS classes for the modal */
  className?: string;
  /** Additional CSS classes for the overlay */
  overlayClassName?: string;
  /** The size of the modal */
  size?: ModalSize;
  /** The position of the modal */
  position?: ModalPosition;
  /** Whether to close the modal when clicking outside */
  closeOnClickOutside?: boolean;
  /** Whether to close the modal when pressing escape */
  closeOnEscape?: boolean;
  /** Whether to prevent scrolling when the modal is open */
  preventScroll?: boolean;
  /** Custom styles for the modal */
  style?: React.CSSProperties;
  /** ID for the modal */
  id?: string;
}

const sizeClassMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]",
};

const positionClassMap: Record<ModalPosition, string> = {
  center: "", // Default position from DialogContent
  top: "top-[10%] translate-y-0", // Override the default vertical centering
};

/**
 * A modal component that renders its children in a dialog.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Modal trigger={<Button>Open Modal</Button>}>
 *   <div className="p-4">Modal content goes here</div>
 * </Modal>
 *
 * // Controlled modal
 * const [open, setOpen] = React.useState(false);
 * <Modal open={open} onOpenChange={setOpen} title="My Modal">
 *   <div className="p-4">Modal content goes here</div>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onOpenChange,
  children,
  trigger,
  title,
  showCloseButton = true,
  className,
  overlayClassName,
  size = "md",
  position = "center",
  closeOnClickOutside = true,
  closeOnEscape = true,
  preventScroll = true,
  style,
  id,
}: ModalProps) {
  // Use CSS to hide the close button if showCloseButton is false
  const hideCloseButtonClass = !showCloseButton
    ? "[&_button[data-radix-collection-item]]:hidden"
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={preventScroll}
      data-modal-id={id}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "p-0 overflow-auto",
          sizeClassMap[size],
          positionClassMap[position],
          hideCloseButtonClass,
          className,
        )}
        style={style}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
        onPointerDownOutside={
          closeOnClickOutside ? undefined : (e) => e.preventDefault()
        }
      >
        {title && (
          <div className="flex items-center border-b p-4">
            <div className="text-lg font-semibold">{title}</div>
          </div>
        )}
        <div className={cn(!title && "pt-4")}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * A component that renders content in the body of a modal.
 */
export function ModalBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * A component that renders content in the footer of a modal.
 */
export function ModalFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { DialogTrigger as ModalTrigger, DialogClose };
