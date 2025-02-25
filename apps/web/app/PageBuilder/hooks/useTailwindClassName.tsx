import { BaseComponentProps } from "@webcraft/types";
import { cn } from "@ui/lib/utils";
const escapeUrlForTailwind = (url: string) => {
  return url
    .replace(/([()])/g, "\\$1") // Escape parentheses
    .replace(/:/g, "\\:") // Escape colons
    .replace(/\//g, "\\/") // Escape slashes
    .replace(/'/g, "") // Remove single quotes
    .replace(/"/g, ""); // Remove double quotes
};

export const getTailwindClassName = (
  props: BaseComponentProps,
  state?: "hover" | "focus" | "active",
): string => {
  const propsClasses = Object.entries(props).map(([key, value]) => {
    if (value === undefined) return;

    // Handle URL values specially
    if (typeof value === "string" && value.startsWith("bg-[url")) {
      const escapedValue = escapeUrlForTailwind(value);
      return state ? `${state}:${escapedValue}` : escapedValue;
    }

    // Rest of your existing logic
    if (["hover", "focus", "active"].includes(key)) {
      if (typeof value === "string") {
        return `${key}:${value}`;
      }
      return getTailwindClassName(value, key as typeof state);
    }

    return state ? `${state}:${value}` : value;
  });

  return cn(propsClasses);
};

// export const getTailwindClassName = (
//   props: BaseComponentProps,
//   state?: string,
// ): string => {
//   const classes: string[] = [];

//   const addClass = (prefix: string, value?: string | number) => {
//     if (value === undefined) return;

//     const classNamePrefix = state ? `${state}:${prefix}` : prefix;

//     if (typeof value === "number") {
//       classes.push(`${classNamePrefix}-${value}`);
//     } else if (/^[0-9]+(px|em|rem|%)$/.test(value)) {
//       classes.push(`${classNamePrefix}-[${value}]`);
//     } else if (
//       /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) ||
//       /^rgb\(.+\)$/.test(value)
//     ) {
//       classes.push(`${classNamePrefix}-[${value}]`);
//     } else {
//       classes.push(`${classNamePrefix}-${value}`);
//     }
//   };

//   // Spacing
//   addClass("m", props.m);
//   addClass("mt", props.mt);
//   addClass("mr", props.mr);
//   addClass("mb", props.mb);
//   addClass("ml", props.ml);
//   addClass("mx", props.mx);
//   addClass("my", props.my);
//   addClass("p", props.p);
//   addClass("pt", props.pt);
//   addClass("pr", props.pr);
//   addClass("pb", props.pb);
//   addClass("pl", props.pl);
//   addClass("px", props.px);
//   addClass("py", props.py);

//   // Typography
//   addClass("text", props.fontSize);
//   addClass("text", props.textColor);
//   addClass("font", props.fontWeight);
//   addClass("text", props.textAlign);

//   // Layout
//   addClass("flex", props.flexDirection);
//   addClass("justify", props.justifyContent);
//   addClass("items", props.alignItems);
//   addClass("gap", props.gap);
//   if (props.display && props.display === Display.FLEX) {
//     classes.push("flex");
//   } else {
//     addClass("display", props.display);
//   }

//   // Sizing
//   addClass("w", props.w);
//   addClass("h", props.h);
//   addClass("max-w", props.maxW);
//   addClass("min-w", props.minW);
//   addClass("max-h", props.maxH);
//   addClass("min-h", props.minH);

//   // Background
//   addClass("bg", props.bg);

//   // Borders
//   if (props.border) classes.push("border");
//   addClass("border", props.borderColor);
//   addClass("rounded", props.rounded);
//   addClass("rounded", props.borderRadius);

//   // Position
//   if (props.position) {
//     classes.push(props.position);
//   }
//   addClass("inset", props.inset);

//   // Additional UI Enhancements
//   // Additional UI Enhancements
//   addClass("shadow", props.shadow);
//   addClass("opacity", props.opacity);
//   addClass("overflow", props.overflow);
//   addClass("visibility", props.visibility);
//   addClass("z", props.zIndex);
//   addClass("transform", props.transform);
//   addClass("transition", props.transition);
//   addClass("backdrop-blur", props.backdropBlur);
//   addClass("outline", props.outline);
//   addClass("ring", props.ring);
//   addClass("ring", props.ringColor);
//   addClass("cursor", props.cursor);

//   // Flex
//   addClass("flex", props.flexWrap);
//   addClass("flex", props.flexGrow);
//   addClass("flex", props.flexShrink);
//   addClass("flex", props.flexBasis);
//   addClass("flex", props.flex);
//   // State
//   const hoverClasses = props.hover
//     ? getTailwindClassName(props.hover, "hover")
//     : "";
//   const focusClasses = props.focus
//     ? getTailwindClassName(props.focus, "focus")
//     : "";
//   const activeClasses = props.active
//     ? getTailwindClassName(props.active, "active")
//     : "";

//   if (props.disabled) {
//     classes.push("disabled");
//   }

//   return twMerge(classes, hoverClasses, focusClasses, activeClasses);
// };
