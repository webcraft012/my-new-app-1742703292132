import * as React from "react";
import { cn } from "../../lib/utils";

export interface PortfolioItem {
  /** Image URL */
  imageUrl: string;
  /** Image alt text */
  imageAlt: string;
  /** Title of the portfolio item */
  title: string;
  /** Optional description or caption */
  description?: string;
  /** Optional category or tag */
  category?: string;
  /** Optional link to detailed view */
  link?: string;
  /** Optional aspect ratio for the image */
  aspectRatio?: "square" | "portrait" | "landscape" | "wide" | "custom";
  /** Optional custom aspect ratio (e.g., "16/9") - only used when aspectRatio is "custom" */
  customAspectRatio?: string;
  /** Optional metadata (e.g., date, location, camera settings) */
  metadata?: {
    [key: string]: string;
  };
}

export interface PortfolioGridProps {
  /** Array of portfolio items to display */
  items: PortfolioItem[];
  /** Number of columns in the grid (1-4) */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between grid items */
  gap?: "none" | "small" | "medium" | "large";
  /** Layout style */
  layout?: "grid" | "masonry" | "carousel";
  /** Whether to show item details on hover or always */
  detailsDisplay?: "hover" | "always" | "overlay" | "below";
  /** Animation style for item hover */
  hoverEffect?: "zoom" | "lift" | "glow" | "fade" | "none";
  /** Whether to enable lightbox on click */
  lightbox?: boolean;
  /** Whether to show category filters */
  showFilters?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for each item */
  itemClassName?: string;
  /** Animation style for filtering */
  filterAnimation?: "fade" | "scale" | "slide" | "none";
}

// Define keyframe animations for filtering
const PortfolioAnimations = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes portfolioItemIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes portfolioItemSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes portfolioItemFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `,
      }}
    />
  );
};

export function PortfolioGrid({
  items,
  columns = 3,
  gap = "medium",
  layout = "grid",
  detailsDisplay = "hover",
  hoverEffect = "zoom",
  lightbox = false,
  showFilters = false,
  className,
  itemClassName,
  filterAnimation = "fade",
}: PortfolioGridProps) {
  // State for active filter (when showFilters is true)
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  // State to track if we're currently filtering (for animations)
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false);
  // Previous filtered items for smooth transitions
  const [prevFilteredItems, setPrevFilteredItems] =
    React.useState<PortfolioItem[]>(items);

  // Get all unique categories for filters
  const categories = React.useMemo(() => {
    if (!showFilters) return [];
    const allCategories = items
      .map((item) => item.category)
      .filter((category): category is string => !!category);
    return ["all", ...Array.from(new Set(allCategories))];
  }, [items, showFilters]);

  // Filter items based on active category
  const filteredItems = React.useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.category === activeFilter);
  }, [items, activeFilter]);

  // Handle filter changes with animation
  const handleFilterChange = (category: string) => {
    if (category === activeFilter) return;

    setIsFiltering(true);
    setPrevFilteredItems(filteredItems);
    setActiveFilter(category);

    // Reset filtering state after animation completes
    setTimeout(() => {
      setIsFiltering(false);
    }, 600); // Match this with the CSS transition duration
  };

  // Determine grid columns based on the columns prop
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  // Determine gap size
  const gapSize = {
    none: "gap-0",
    small: "gap-2",
    medium: "gap-4",
    large: "gap-8",
  }[gap];

  // Get aspect ratio class or style
  const getAspectRatio = (
    item: PortfolioItem,
  ): { className: string; style?: React.CSSProperties } => {
    // For predefined aspect ratios, use Tailwind classes
    switch (item.aspectRatio) {
      case "square":
        return { className: "aspect-square" };
      case "portrait":
        return { className: "aspect-[3/4]" };
      case "landscape":
        return { className: "aspect-[4/3]" };
      case "wide":
        return { className: "aspect-[16/9]" };
      case "custom":
        if (item.customAspectRatio) {
          // For custom aspect ratios, use inline style instead of dynamic class name
          return {
            className: "",
            style: { aspectRatio: item.customAspectRatio },
          };
        }
        return { className: "aspect-square" };
      default:
        return { className: "aspect-square" };
    }
  };

  // Get hover effect classes
  const getHoverEffectClasses = () => {
    switch (hoverEffect) {
      case "zoom":
        return "group-hover:scale-105";
      case "lift":
        return "group-hover:-translate-y-2";
      case "glow":
        return "group-hover:shadow-glow";
      case "fade":
        return "group-hover:opacity-80";
      case "none":
      default:
        return "";
    }
  };

  // Get details display classes
  const getDetailsClasses = () => {
    switch (detailsDisplay) {
      case "always":
        return "opacity-100";
      case "hover":
        return "opacity-0 group-hover:opacity-100";
      case "overlay":
        return "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 text-white";
      case "below":
        return "mt-2 opacity-100";
      default:
        return "opacity-0 group-hover:opacity-100";
    }
  };

  // Get filter animation classes
  const getFilterAnimationClasses = () => {
    if (filterAnimation === "none") return "";

    switch (filterAnimation) {
      case "fade":
        return "transition-opacity duration-500 ease-in-out";
      case "scale":
        return "transition-transform duration-500 ease-in-out";
      case "slide":
        return "transition-all duration-500 ease-in-out";
      default:
        return "transition-opacity duration-500 ease-in-out";
    }
  };

  // Get animation style for each item based on index
  const getItemAnimationStyle = (index: number): React.CSSProperties => {
    // No animation styles if not filtering or animation is disabled
    if (!isFiltering || filterAnimation === "none") {
      return {};
    }

    // Stagger the animations based on item index
    const delay = Math.min(index * 50, 300); // Cap the delay at 300ms

    // Choose the animation name based on the selected animation type
    let animationName = "portfolioItemFadeIn";
    if (filterAnimation === "scale") animationName = "portfolioItemIn";
    if (filterAnimation === "slide") animationName = "portfolioItemSlideIn";

    return {
      animationDelay: `${delay}ms`,
      animationDuration: "500ms",
      animationFillMode: "forwards",
      animationName: animationName,
      animationTimingFunction: "ease-out",
    };
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Add keyframe animations */}
      <PortfolioAnimations />

      {/* Category filters */}
      {showFilters && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                activeFilter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Portfolio grid */}
      <div
        className={cn(
          layout === "masonry"
            ? "columns-1 sm:columns-2 lg:columns-3 gap-4"
            : `grid ${gridCols} ${gapSize}`,
        )}
      >
        {filteredItems.map((item, index) => {
          // Get aspect ratio configuration
          const aspectRatio = getAspectRatio(item);

          return (
            <div
              key={`${item.imageUrl}-${index}`}
              className={cn(
                "group relative overflow-hidden rounded-lg",
                layout === "masonry" ? "mb-4 break-inside-avoid" : "",
                detailsDisplay !== "below" ? "h-full" : "",
                getFilterAnimationClasses(),
                itemClassName,
              )}
              style={getItemAnimationStyle(index)}
            >
              {/* Image container */}
              <div
                className={cn(
                  "overflow-hidden",
                  detailsDisplay !== "below" ? "h-full" : "",
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    aspectRatio.className,
                    getHoverEffectClasses(),
                  )}
                  style={aspectRatio.style}
                />

                {/* Overlay details */}
                {detailsDisplay === "overlay" && (
                  <div className={getDetailsClasses()}>
                    {item.category && (
                      <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 mb-1">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-primary-foreground/90">
                        {item.description}
                      </p>
                    )}
                    {item.metadata && (
                      <div className="mt-2 text-xs text-primary-foreground/70">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Below details */}
              {detailsDisplay === "below" && (
                <div className={getDetailsClasses()}>
                  {item.category && (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.metadata && (
                    <div className="mt-2 text-xs text-muted-foreground/70">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hover details (for hover and always modes) */}
              {(detailsDisplay === "hover" || detailsDisplay === "always") && (
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 flex flex-col justify-end p-4 text-white transition-opacity duration-300",
                    getDetailsClasses(),
                  )}
                >
                  {item.category && (
                    <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 mb-1">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-primary-foreground/90">
                      {item.description}
                    </p>
                  )}
                  {item.metadata && (
                    <div className="mt-2 text-xs text-primary-foreground/70">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Link wrapper */}
              {item.link && (
                <a
                  href={item.link}
                  className="absolute inset-0 z-10"
                  aria-label={`View details for ${item.title}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
