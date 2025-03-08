import * as React from "react";
import {
  BasicCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./basic-card";
import { cn } from "../../lib/utils";

export interface CardComponentProps {
  /** The title of the card */
  title?: React.ReactNode;
  /** The subtitle or description of the card */
  subtitle?: React.ReactNode;
  /** The main content of the card */
  content?: React.ReactNode;
  /** Optional action buttons to display in the card */
  actions?: React.ReactNode;
  /** Optional image URL to display in the card */
  image?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Position of the image: 'top', 'bottom', 'left', or 'right' */
  imagePosition?: "top" | "bottom" | "left" | "right";
  /** Whether the card should have hover effects */
  interactive?: boolean;
  /** Additional CSS classes for the card */
  className?: string;
  /** Additional CSS classes for the header */
  headerClassName?: string;
  /** Additional CSS classes for the content */
  contentClassName?: string;
  /** Additional CSS classes for the footer */
  footerClassName?: string;
  /** Additional CSS classes for the image */
  imageClassName?: string;
  /** Additional props to pass to the card */
  cardProps?: React.ComponentProps<typeof BasicCard>;
}

export function Card({
  title,
  subtitle,
  content,
  actions,
  image,
  imageAlt = "Card image",
  imagePosition = "top",
  interactive = false,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  imageClassName,
  cardProps,
}: CardComponentProps) {
  // Determine if we need a horizontal layout
  const isHorizontal = imagePosition === "left" || imagePosition === "right";

  // Build the card class based on props
  const cardClass = cn(
    // Default width
    "w-full max-w-md",
    // Add interactive styles if needed
    interactive &&
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
    // Add horizontal layout if needed
    isHorizontal && "flex flex-row overflow-hidden p-0",
    // Remove top padding if image is at the top
    imagePosition === "top" && "pt-0",
    // Remove bottom padding if image is at the bottom
    imagePosition === "bottom" && "pb-0",
    // Ensure consistent padding
    !isHorizontal && !image && "py-4",
    // Add custom class
    className,
  );

  // Create the image element if an image URL is provided
  const imageElement = image ? (
    <div
      className={cn(
        "overflow-hidden",
        isHorizontal
          ? imagePosition === "left"
            ? "w-1/3 rounded-l-xl"
            : "w-1/3 rounded-r-xl order-last"
          : imagePosition === "top"
            ? "w-full rounded-t-xl"
            : "w-full rounded-b-xl order-last",
        imageClassName,
      )}
      style={{
        aspectRatio: isHorizontal ? "1/1" : "16/9",
        minHeight: isHorizontal ? "100%" : "auto",
      }}
    >
      <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
    </div>
  ) : null;

  // Create the content container with appropriate padding
  const contentContainer = (
    <div className={cn("flex flex-col gap-2", isHorizontal && "w-2/3 p-6")}>
      {/* Render header if title or subtitle exists */}
      {(title || subtitle) && (
        <CardHeader
          className={cn(
            // Remove top padding if image is at the top
            imagePosition === "top" && "pt-4",
            headerClassName,
          )}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}

      {/* Render content if it exists */}
      {content && (
        <CardContent className={contentClassName}>{content}</CardContent>
      )}

      {/* Render footer with actions if they exist */}
      {actions && (
        <CardFooter
          className={cn(
            "flex justify-end items-center pb-0 mt-2",
            footerClassName,
          )}
        >
          <div className="flex gap-2">{actions}</div>
        </CardFooter>
      )}
    </div>
  );

  // For horizontal layouts, we need a different structure
  if (isHorizontal) {
    return (
      <BasicCard className={cardClass} {...cardProps}>
        {imagePosition === "left" ? (
          <>
            {imageElement}
            {contentContainer}
          </>
        ) : (
          <>
            {contentContainer}
            {imageElement}
          </>
        )}
      </BasicCard>
    );
  }

  // For vertical layouts (top/bottom image)
  return (
    <BasicCard className={cardClass} {...cardProps}>
      {imagePosition === "top" && imageElement}
      {contentContainer}
      {imagePosition === "bottom" && imageElement}
    </BasicCard>
  );
}
