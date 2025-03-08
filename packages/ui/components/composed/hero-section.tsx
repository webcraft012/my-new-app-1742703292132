import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export interface HeroAction {
  /** Text to display on the button */
  label: string;
  /** URL to navigate to when clicked */
  href?: string;
  /** Button variant */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "dark-outline";
  /** Whether this is the primary action */
  primary?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
}

export type HeroThemeVariant =
  | "default" // Dark background with white text
  | "light" // Light background with dark text
  | "primary" // Primary color gradient
  | "secondary" // Secondary color gradient
  | "accent" // Accent color gradient
  | "custom"; // Use custom colors (requires backgroundColor, textColor props)

// Define the theme configuration interface
interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  overlayColor: string;
  isDark: boolean;
  waveColor: string;
  gradient?: boolean;
  gradientDirection?: string;
  gradientFromColor?: string;
  gradientToColor?: string;
}

export interface HeroSectionProps {
  /** Main heading text */
  heading: React.ReactNode;
  /** Subheading or description text */
  subheading?: React.ReactNode;
  /** Background image URL */
  backgroundImage?: string;
  /** Theme variant to use */
  variant?: HeroThemeVariant;
  /** Background color (used if variant is 'custom' or no image) */
  backgroundColor?: string;
  /** Text color (used if variant is 'custom') */
  textColor?: string;
  /** Background overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Content alignment */
  align?: "left" | "center" | "right";
  /** Content width */
  contentWidth?: "narrow" | "medium" | "wide" | "full";
  /** Vertical padding */
  padding?: "small" | "medium" | "large" | "none";
  /** Minimum height */
  minHeight?: string;
  /** Whether to make the hero fullscreen */
  fullscreen?: boolean;
  /** Whether to add a wave/curve at the bottom */
  wave?: boolean;
  /** Call to action buttons */
  actions?: HeroAction[];
  /** Additional content to render below heading and subheading */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate the hero on entry */
  animated?: boolean;
  /** Optional foreground image (e.g., product image, illustration) */
  foregroundImage?: string;
  /** Foreground image position */
  foregroundPosition?: "left" | "right" | "bottom";
  /** Foreground image width (percentage or pixel value) */
  foregroundWidth?: string;
  /** Foreground image alt text */
  foregroundAlt?: string;
}

// Theme variant configurations
const themeVariants: Record<HeroThemeVariant, ThemeConfig> = {
  default: {
    backgroundColor: "bg-slate-900",
    textColor: "text-white",
    overlayColor: "bg-black",
    isDark: true,
    waveColor: "fill-white",
  },
  light: {
    backgroundColor: "bg-white",
    textColor: "text-slate-900",
    overlayColor: "bg-slate-200",
    isDark: false,
    waveColor: "fill-slate-100",
  },
  primary: {
    backgroundColor: "bg-transparent",
    textColor: "text-white",
    overlayColor: "bg-black",
    gradient: true,
    gradientDirection: "to-r",
    gradientFromColor: "from-blue-600",
    gradientToColor: "to-indigo-600",
    isDark: true,
    waveColor: "fill-white",
  },
  secondary: {
    backgroundColor: "bg-transparent",
    textColor: "text-white",
    overlayColor: "bg-black",
    gradient: true,
    gradientDirection: "to-r",
    gradientFromColor: "from-purple-600",
    gradientToColor: "to-pink-600",
    isDark: true,
    waveColor: "fill-white",
  },
  accent: {
    backgroundColor: "bg-transparent",
    textColor: "text-white",
    overlayColor: "bg-black",
    gradient: true,
    gradientDirection: "to-br",
    gradientFromColor: "from-teal-500",
    gradientToColor: "to-emerald-500",
    isDark: true,
    waveColor: "fill-white",
  },
  custom: {
    // Will use provided backgroundColor and textColor
    backgroundColor: "",
    textColor: "",
    overlayColor: "bg-black",
    isDark: false, // Will be determined based on backgroundColor
    waveColor: "fill-white",
  },
};

export function HeroSection({
  heading,
  subheading,
  backgroundImage,
  variant = "default",
  backgroundColor,
  textColor,
  overlayOpacity = 50,
  align = "center",
  contentWidth = "medium",
  padding = "large",
  minHeight = "500px",
  fullscreen = false,
  wave = false,
  actions = [],
  children,
  className,
  animated = false,
  foregroundImage,
  foregroundPosition = "right",
  foregroundWidth = "40%",
  foregroundAlt = "Hero image",
}: HeroSectionProps) {
  // Get theme configuration based on variant
  const theme = themeVariants[variant];

  // Use custom colors if provided and variant is 'custom'
  const bgColor =
    variant === "custom" && backgroundColor
      ? backgroundColor
      : theme.backgroundColor;
  const txtColor =
    variant === "custom" && textColor ? textColor : theme.textColor;
  const overlayColor = theme.overlayColor;

  // Determine if we're using a dark background
  const isDarkBackground =
    variant === "custom"
      ? backgroundColor?.includes("slate-900") ||
        backgroundColor?.includes("black") ||
        overlayOpacity > 40
      : theme.isDark;

  // Calculate overlay opacity class
  const overlayOpacityClass = `bg-opacity-${overlayOpacity}`;

  // Determine content width class
  const contentWidthClass = {
    narrow: "max-w-md",
    medium: "max-w-2xl",
    wide: "max-w-4xl",
    full: "w-full",
  }[contentWidth];

  // Determine padding classes
  const paddingClass = {
    none: "py-0",
    small: "py-8",
    medium: "py-16",
    large: "py-24",
  }[padding];

  // Determine alignment classes
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  // Determine foreground position classes
  const foregroundPositionClass = {
    left: "left-0 order-first md:order-first",
    right: "right-0 order-last md:order-last",
    bottom: "bottom-0 order-last",
  }[foregroundPosition];

  // Animation classes
  const animationClass = animated ? "animate-fade-in-up" : "";

  // Determine if we need a flex layout for foreground image
  const hasHorizontalForeground =
    foregroundImage &&
    (foregroundPosition === "left" || foregroundPosition === "right");

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        bgColor,
        theme.gradient &&
          `bg-gradient-${theme.gradientDirection} ${theme.gradientFromColor} ${theme.gradientToColor}`,
        txtColor,
        fullscreen ? "min-h-screen" : "",
        className,
      )}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: !fullscreen ? minHeight : undefined,
      }}
    >
      {/* Background Overlay */}
      {(overlayOpacity > 0 || backgroundImage) && (
        <div
          className={cn("absolute inset-0", overlayColor, overlayOpacityClass)}
        />
      )}

      {/* Content Container */}
      <div
        className={cn(
          "relative z-10 flex flex-col justify-center h-full w-full",
          paddingClass,
          hasHorizontalForeground ? "px-4 md:px-8" : "px-4 md:px-12",
        )}
      >
        <div
          className={cn(
            "mx-auto",
            contentWidthClass,
            hasHorizontalForeground
              ? "flex flex-col md:flex-row items-center gap-8 w-full max-w-7xl"
              : "",
          )}
        >
          {/* Text Content */}
          <div
            className={cn(
              "flex flex-col",
              alignClass,
              hasHorizontalForeground ? "flex-1" : "",
              animationClass,
            )}
          >
            {/* Heading */}
            {typeof heading === "string" ? (
              <h1
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
                )}
              >
                {heading}
              </h1>
            ) : (
              heading
            )}

            {/* Subheading */}
            {subheading &&
              (typeof subheading === "string" ? (
                <p
                  className={cn(
                    "mt-4 text-lg md:text-xl",
                    align === "center" ? "mx-auto" : "",
                  )}
                >
                  {subheading}
                </p>
              ) : (
                subheading
              ))}

            {/* Actions */}
            {actions.length > 0 && (
              <div
                className={cn(
                  "mt-8 flex flex-wrap gap-4",
                  align === "center" && "justify-center",
                  align === "right" && "justify-end",
                )}
              >
                {actions.map((action, index) => {
                  // Determine if this is a primary or secondary action
                  const isPrimary =
                    action.primary || action.variant === "default";

                  // On dark backgrounds, use dark-outline for secondary buttons
                  let buttonVariant = action.variant;

                  // If no variant is specified, use default for primary, and appropriate variant for secondary
                  if (!buttonVariant) {
                    if (isPrimary) {
                      buttonVariant = "default";
                    } else {
                      // Use dark-outline for secondary buttons on dark backgrounds
                      buttonVariant = isDarkBackground
                        ? "dark-outline"
                        : "outline";
                    }
                  }

                  // If secondary variant is specified and we're on a dark background, use dark-outline
                  if (buttonVariant === "secondary" && isDarkBackground) {
                    buttonVariant = "dark-outline";
                  }

                  return (
                    <Button
                      key={index}
                      variant={buttonVariant}
                      asChild={!!action.href}
                      onClick={action.onClick}
                    >
                      {action.href ? (
                        <a href={action.href}>
                          {action.icon && (
                            <span className="mr-2">{action.icon}</span>
                          )}
                          {action.label}
                        </a>
                      ) : (
                        <>
                          {action.icon && (
                            <span className="mr-2">{action.icon}</span>
                          )}
                          {action.label}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Additional Content */}
            {children && <div className="mt-8">{children}</div>}
          </div>

          {/* Foreground Image */}
          {foregroundImage && (
            <div
              className={cn(
                "relative",
                foregroundPositionClass,
                foregroundPosition === "bottom" ? "mt-8 w-full" : "",
                animated ? "animate-fade-in" : "",
              )}
              style={{
                width:
                  foregroundPosition !== "bottom" ? foregroundWidth : "auto",
                maxWidth: "100%",
              }}
            >
              <img
                src={foregroundImage}
                alt={foregroundAlt}
                className={cn(
                  "w-full h-auto object-contain",
                  foregroundPosition === "bottom" ? "max-h-[300px]" : "",
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Wave/Curve Decoration */}
      {wave && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className={cn(
              "relative block w-full h-[60px] md:h-[120px]",
              theme.waveColor,
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
            />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      )}
    </section>
  );
}
