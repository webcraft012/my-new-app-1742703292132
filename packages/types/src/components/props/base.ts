export interface BaseComponentProps {
  "data-id"?: string;
  // Spacing
  m?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
  mx?: string;
  my?: string;
  p?: string;
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
  px?: string;
  py?: string;

  // Typography
  fontSize?: string;
  textColor?: string;
  fontWeight?: string;
  textAlign?: string;

  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  flex?: string;
  flexWrap?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;

  // Sizing
  w?: string;
  h?: string;
  maxW?: string;
  minW?: string;
  maxH?: string;
  minH?: string;

  // Background
  bg?: string;

  // Borders
  border?: string;
  borderColor?: string;
  borderRadius?: string;

  // Position
  position?: string;
  inset?: string;

  // Additional UI Enhancements
  shadow?: string;
  opacity?: string;
  overflow?: string;
  visibility?: string;
  rounded?: string;
  zIndex?: string;
  transform?: string;
  transition?: string;
  backdropBlur?: string;
  outline?: string;
  ring?: string;
  ringColor?: string;
  cursor?: string;
  disabled?: string;

  //self
  alignSelf?: string;
  // state
  hover?: BaseComponentProps;
  focus?: BaseComponentProps;
  active?: BaseComponentProps;
}

// export enum Cursor {
//   AUTO = "auto",
//   DEFAULT = "default",
//   POINTER = "pointer",
//   WAIT = "wait",
//   TEXT = "text",
//   MOVE = "move",
//   NOT_ALLOWED = "not-allowed",
// }

// export enum FlexWrap {
//   NOWRAP = "nowrap",
//   WRAP = "wrap",
//   WRAP_REVERSE = "wrap-reverse",
// }

// export enum FlexGrow {
//   GROW_0 = "0",
//   GROW = "1",
// }

// export enum FlexShrink {
//   SHRINK_0 = "0",
//   SHRINK = "1",
// }

// export enum FontSize {
//   XS = "xs",
//   SM = "sm",
//   BASE = "base",
//   LG = "lg",
//   XL = "xl",
//   XL_2 = "2xl",
//   XL_3 = "3xl",
//   XL_4 = "4xl",
//   XL_5 = "5xl",
//   XL_6 = "6xl",
//   XL_7 = "7xl",
//   XL_8 = "8xl",
//   XL_9 = "9xl",
// }

// export enum FontWeight {
//   THIN = "thin",
//   EXTRA_LIGHT = "extralight",
//   LIGHT = "light",
//   NORMAL = "normal",
//   MEDIUM = "medium",
//   SEMI_BOLD = "semibold",
//   BOLD = "bold",
//   EXTRA_BOLD = "extrabold",
//   BLACK = "black",
// }

// export enum TextAlign {
//   LEFT = "left",
//   CENTER = "center",
//   RIGHT = "right",
//   JUSTIFY = "justify",
// }

// export enum Display {
//   BLOCK = "block",
//   INLINE_BLOCK = "inline-block",
//   INLINE = "inline",
//   FLEX = "flex",
//   INLINE_FLEX = "inline-flex",
//   GRID = "grid",
//   INLINE_GRID = "inline-grid",
//   NONE = "none",
// }

// export enum FlexDirection {
//   ROW = "row",
//   ROW_REVERSE = "row-reverse",
//   COLUMN = "col",
//   COLUMN_REVERSE = "col-reverse",
// }

// export enum JustifyContent {
//   START = "start",
//   END = "end",
//   CENTER = "center",
//   BETWEEN = "between",
//   AROUND = "around",
//   EVENLY = "evenly",
// }

// export enum AlignItems {
//   START = "start",
//   END = "end",
//   CENTER = "center",
//   BASELINE = "baseline",
//   STRETCH = "stretch",
// }

// export enum SizeOptions {
//   AUTO = "auto",
//   FULL = "full",
//   SCREEN = "screen",
//   MIN = "min",
//   MAX = "max",
//   FIT = "fit",
// }

// export enum BorderRadius {
//   NONE = "none",
//   SM = "sm",
//   MD = "md",
//   LG = "lg",
//   XL = "xl",
//   XL_2 = "2xl",
//   XL_3 = "3xl",
//   FULL = "full",
// }

// export enum Position {
//   STATIC = "static",
//   FIXED = "fixed",
//   ABSOLUTE = "absolute",
//   RELATIVE = "relative",
//   STICKY = "sticky",
// }

// export enum Shadow {
//   SM = "sm",
//   MD = "md",
//   LG = "lg",
//   XL = "xl",
//   XL_2 = "2xl",
//   NONE = "none",
// }

// export enum Overflow {
//   VISIBLE = "visible",
//   HIDDEN = "hidden",
//   SCROLL = "scroll",
//   AUTO = "auto",
// }

// export enum Visibility {
//   VISIBLE = "visible",
//   INVISIBLE = "invisible",
//   COLLAPSE = "collapse",
// }
