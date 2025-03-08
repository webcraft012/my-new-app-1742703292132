import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  BasicCard as Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/basic-card";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ItemImage {
  /** URL of the image */
  src: string;
  /** Alt text for the image */
  alt: string;
}

export interface ItemCardProps {
  /** Title of the item */
  title: string;
  /** Description of the item */
  description?: string;
  /** Price of the item (can be a string to allow for custom formatting) */
  price?: string | number;
  /** Original/compare-at price (for sale items) */
  originalPrice?: string | number;
  /** Currency symbol to display before the price */
  currencySymbol?: string;
  /** Array of images for the item */
  images?: ItemImage[];
  /** Badge text to display (e.g., "Sale", "New", "Featured") */
  badge?: string;
  /** Badge variant/color */
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  /** Primary action button text */
  primaryActionText?: string;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Handler for primary action button click */
  onPrimaryActionClick?: () => void;
  /** Handler for secondary action button click */
  onSecondaryActionClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS classes for the image container */
  imageClassName?: string;
  /** Additional CSS classes for the content container */
  contentClassName?: string;
  /** Additional CSS classes for the footer */
  footerClassName?: string;
  /** Whether to show image navigation arrows */
  showImageNavigation?: boolean;
  /** Whether to show image indicators/dots */
  showImageIndicators?: boolean;
  /** Whether the card should have hover effects */
  interactive?: boolean;
  /** Aspect ratio for the images */
  imageAspectRatio?: "square" | "portrait" | "landscape" | "auto";
  /** Whether to enable image zoom on hover */
  imageZoom?: boolean;
  /** Additional details to display (key-value pairs) */
  details?: Record<string, string>;
  /** Custom renderer for price display */
  renderPrice?: (
    price: string | number,
    originalPrice?: string | number,
    currencySymbol?: string,
  ) => React.ReactNode;
  /** Custom renderer for the action buttons */
  renderActions?: () => React.ReactNode;
  /** Maximum height for the image section (e.g., '200px', '15rem') */
  imageMaxHeight?: string;
}

export function ItemCard({
  title,
  description,
  price,
  originalPrice,
  currencySymbol = "$",
  images = [],
  badge,
  badgeVariant = "default",
  primaryActionText = "Add to Cart",
  secondaryActionText,
  onPrimaryActionClick,
  onSecondaryActionClick,
  className,
  imageClassName,
  contentClassName,
  footerClassName,
  showImageNavigation = true,
  showImageIndicators = true,
  interactive = false,
  imageAspectRatio = "square",
  imageZoom = false,
  details,
  renderPrice,
  renderActions,
  imageMaxHeight = "200px",
}: ItemCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Determine image aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "aspect-auto",
  }[imageAspectRatio];

  // Format price display
  const formatPrice = () => {
    if (renderPrice && price !== undefined) {
      return renderPrice(price, originalPrice, currencySymbol);
    }

    if (price === undefined) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-lg font-semibold",
            originalPrice && "text-destructive",
          )}
        >
          {typeof price === "number"
            ? `${currencySymbol}${price.toFixed(2)}`
            : `${currencySymbol}${price}`}
        </span>
        {originalPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {typeof originalPrice === "number"
              ? `${currencySymbol}${originalPrice.toFixed(2)}`
              : `${currencySymbol}${originalPrice}`}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "overflow-hidden p-0",
        interactive && "transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      {/* Image Gallery */}
      {images.length > 0 && (
        <div
          className={cn(
            "relative overflow-hidden",
            aspectRatioClass,
            imageZoom && "group",
            imageClassName,
          )}
          style={{ maxHeight: imageMaxHeight }}
        >
          <div
            className={cn(
              "w-full h-full bg-cover bg-center transition-transform duration-300",
              imageZoom && "group-hover:scale-110",
            )}
            style={{ backgroundImage: `url(${images[currentImageIndex].src})` }}
            role="img"
            aria-label={images[currentImageIndex].alt}
          />

          {/* Navigation Arrows */}
          {showImageNavigation && images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {showImageIndicators && images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-primary/30 hover:bg-primary/60",
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div className="absolute top-2 left-2">
              <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight mb-1">{title}</h3>

        {/* Content */}
        <div className={cn("space-y-2", contentClassName)}>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {price !== undefined && <div className="pt-1">{formatPrice()}</div>}

          {details && Object.keys(details).length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-1">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className={cn("pt-3", footerClassName)}>
            {renderActions ? (
              renderActions()
            ) : (
              <div className="flex gap-2 w-full">
                {primaryActionText && (
                  <Button
                    onClick={onPrimaryActionClick}
                    className="flex-1"
                    size="sm"
                  >
                    {primaryActionText}
                  </Button>
                )}
                {secondaryActionText && (
                  <Button
                    variant="outline"
                    onClick={onSecondaryActionClick}
                    className="flex-1"
                    size="sm"
                  >
                    {secondaryActionText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
