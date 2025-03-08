import * as React from "react";
import { cn } from "../../lib/utils";

export interface ServiceItem {
  /** Title of the service or feature */
  title: string;
  /** Description of the service or feature */
  description: string;
  /** Icon component to display (React component) */
  icon?: React.ReactNode;
  /** Optional link URL */
  link?: string;
  /** Optional link text */
  linkText?: string;
  /** Optional accent color (CSS color value) */
  accentColor?: string;
}

export interface ServicesListProps {
  /** Heading for the services list */
  heading?: string;
  /** Subheading or description for the services list */
  subheading?: string;
  /** Array of service items to display */
  items: ServiceItem[];
  /** Number of columns to display (1-4) */
  columns?: 1 | 2 | 3 | 4;
  /** Layout style: 'grid', 'list', or 'cards' */
  layout?: "grid" | "list" | "cards";
  /** Whether to center the text in each item */
  centered?: boolean;
  /** Visual style: 'minimal', 'bordered', or 'elevated' */
  variant?: "minimal" | "bordered" | "elevated";
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for each item */
  itemClassName?: string;
  /** Whether to add hover effects to items */
  interactive?: boolean;
  /** Optional heading style: 'default', 'gradient', 'underline', 'boxed' */
  headingStyle?: "default" | "gradient" | "underline" | "boxed";
}

export function ServicesList({
  heading,
  subheading,
  items,
  columns = 3,
  layout = "grid",
  centered = false,
  variant = "minimal",
  className,
  itemClassName,
  interactive = false,
  headingStyle = "gradient",
}: ServicesListProps) {
  // Determine the grid columns based on the columns prop
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  // Get heading styles based on headingStyle prop
  const getHeadingStyles = () => {
    switch (headingStyle) {
      case "gradient":
        return "bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70";
      case "underline":
        return "relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-primary after:rounded-full";
      case "boxed":
        return "inline-block px-4 py-1 bg-primary/10 text-primary rounded-lg";
      default:
        return "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header section with enhanced styling */}
      {(heading || subheading) && (
        <div
          className={cn(
            "mb-16 space-y-6",
            centered && "text-center",
            "relative",
          )}
        >
          {heading && (
            <h2
              className={cn(
                "text-4xl font-extrabold tracking-tight leading-tight",
                "md:text-5xl",
                getHeadingStyles(),
                centered &&
                  headingStyle === "underline" &&
                  "after:left-1/2 after:-translate-x-1/2",
              )}
            >
              {heading}
            </h2>
          )}

          {subheading && (
            <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed mx-auto">
              {subheading}
            </p>
          )}

          {headingStyle !== "underline" && headingStyle !== "boxed" && (
            <div
              className={cn(
                "h-1.5 w-24 bg-primary/80 rounded-full mt-6",
                centered && "mx-auto",
              )}
            />
          )}

          {/* Decorative element */}
          <div className="absolute -z-10 w-64 h-64 blur-3xl rounded-full opacity-20 bg-primary/30 -top-32 -left-32" />
        </div>
      )}

      {/* Services/features list with improved styling */}
      <div
        className={cn(
          layout === "grid" ? `grid ${gridCols} gap-8` : "space-y-8",
          layout === "cards" && `grid ${gridCols} gap-8`,
        )}
      >
        {items.map((item, index) => {
          // Create item styles based on variant and props
          const itemStyles = cn(
            "rounded-xl p-6 transition-all duration-300",
            centered && "text-center",
            interactive && "cursor-pointer",
            variant === "bordered" && "border border-border",
            variant === "elevated" && "shadow-md bg-card",
            layout === "cards" && "flex flex-col h-full",
            interactive && variant === "minimal" && "hover:bg-muted/50",
            interactive &&
              variant === "bordered" &&
              "hover:border-primary/50 hover:shadow-sm",
            interactive &&
              variant === "elevated" &&
              "hover:shadow-lg hover:-translate-y-1",
            itemClassName,
          );

          // Create additional inline styles for accent colors
          const inlineStyles: React.CSSProperties = {
            animationDelay: `${index * 100}ms`,
          };

          // Add border-left style if accent color is provided and variant is bordered
          if (item.accentColor && variant === "bordered") {
            inlineStyles.borderLeftWidth = "4px";
            inlineStyles.borderLeftColor = item.accentColor;
          }

          return (
            <div key={index} className={itemStyles} style={inlineStyles}>
              {/* Icon with improved styling */}
              {item.icon && (
                <div
                  className={cn(
                    "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl relative overflow-hidden",
                    centered && "mx-auto",
                  )}
                  style={{
                    backgroundColor: item.accentColor
                      ? `${item.accentColor}10` // 10% opacity
                      : "var(--primary-10)",
                  }}
                >
                  <div className="relative z-10 text-lg">{item.icon}</div>
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `linear-gradient(135deg, transparent, ${
                        item.accentColor || "var(--primary)"
                      })`,
                    }}
                  />
                </div>
              )}

              {/* Title with improved styling */}
              <h3
                className={cn(
                  "mb-3 text-2xl font-bold tracking-tight",
                  item.accentColor && "text-transparent bg-clip-text",
                )}
                style={
                  item.accentColor
                    ? {
                        backgroundImage: `linear-gradient(to right, ${item.accentColor}, ${item.accentColor}CC)`,
                      }
                    : {}
                }
              >
                {item.title}
              </h3>

              {/* Description with improved styling */}
              <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                {item.description}
              </p>

              {/* Optional link with improved styling */}
              {item.link && (
                <div className={layout === "cards" ? "mt-auto pt-4" : ""}>
                  <a
                    href={item.link}
                    className="text-primary font-medium hover:underline inline-flex items-center group"
                    style={item.accentColor ? { color: item.accentColor } : {}}
                  >
                    {item.linkText || "Learn more"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
