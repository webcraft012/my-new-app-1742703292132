/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
  ],
  safelist: [
    // Static, non-dynamic classes that are added as literalss
    "flex",
    "border",
    "disabled",
    "transform",
    "transition",

    {
      pattern: /^bg-\\\[url\([^)]+\)\\\]$/, // Properly escaped regex
      variants: ["hover", "focus", "active"],
    },

    // ────────────────────────────────
    // Spacing (m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py)
    // Allow numbers 0–20 or arbitrary values in brackets.
    {
      pattern:
        /^(hover:|focus:|active:)?(m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py)-((?:[0-9]|1[0-9]|20)|\[[^\]]+\])$/,
    },

    // ────────────────────────────────
    // Typography
    // Font size (from your FontSize enum)
    {
      pattern:
        /^(hover:|focus:|active:)?text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    },
    // Text color (assuming Tailwind color names like red-500, blue-500, etc. or bracketed values)
    {
      pattern: /^(hover:|focus:|active:)?text-([a-z]+-\d{3}|\[[^\]]+\])$/,
    },
    // Font weight
    {
      pattern:
        /^(hover:|focus:|active:)?font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    // Text align
    {
      pattern: /^(hover:|focus:|active:)?text-(left|center|right|justify)$/,
    },

    // ────────────────────────────────
    // Layout
    // Display (for non-flex displays)
    {
      pattern:
        /^(hover:|focus:|active:)?(block|inline-block|inline|grid|inline-grid|hidden)$/,
    },
    // Flex direction (your FlexDirection enum)
    {
      pattern:
        /^(hover:|focus:|active:)?flex-(row|row-reverse|col|col-reverse)$/,
    },
    // Justify content (your JustifyContent enum)
    {
      pattern:
        /^(hover:|focus:|active:)?justify-(start|end|center|between|around|evenly)$/,
    },
    // Align items (your AlignItems enum)
    {
      pattern:
        /^(hover:|focus:|active:)?items-(start|end|center|baseline|stretch)$/,
    },
    // Gap (allow numbers 0–20 or bracketed values)
    {
      pattern: /^(hover:|focus:|active:)?gap-((?:[0-9]|1[0-9]|20)|\[[^\]]+\])$/,
    },
    // Flex (if using numbers; assume 0–10)
    {
      pattern: /^(hover:|focus:|active:)?flex-([0-9]|10)$/,
    },
    // Flex wrap (from your FlexWrap enum)
    {
      pattern: /^(hover:|focus:|active:)?flex-(nowrap|wrap|wrap-reverse)$/,
    },
    // Flex grow and shrink (expecting 0 or 1)
    {
      pattern: /^(hover:|focus:|active:)?flex-(0|1)$/,
    },
    // ────────────────────────────────
    // Sizing (w, h, max-w, min-w, max-h, min-h)
    // Allow numbers (up to three digits), known keywords or bracketed values.
    {
      pattern:
        /^(hover:|focus:|active:)?(w|h|max-w|min-w|max-h|min-h)-((?:\d{1,3})|auto|full|screen|min|max|fit|\[[^\]]+\])$/,
    },

    // ────────────────────────────────
    // Background
    {
      pattern: /^(hover:|focus:|active:)?bg-(.+)$/,
    },

    // ────────────────────────────────
    // Borders
    // Border color
    {
      pattern: /^(hover:|focus:|active:)?border-([a-z]+-\d{3}|\[[^\]]+\])$/,
    },
    // Rounded (using BorderRadius enum or bracketed values)
    {
      pattern:
        /^(hover:|focus:|active:)?rounded-(none|sm|md|lg|xl|2xl|3xl|full|\[[^\]]+\])$/,
    },

    // ────────────────────────────────
    // Position
    // Position (static, fixed, absolute, relative, sticky) – added as literals
    {
      pattern: /^(static|fixed|absolute|relative|sticky)$/,
    },
    // Inset (allow numbers 0–20 or bracketed values)
    {
      pattern:
        /^(hover:|focus:|active:)?inset-((?:[0-9]|1[0-9]|20)|\[[^\]]+\])$/,
    },

    // ────────────────────────────────
    // Additional UI Enhancements
    // Shadow (using your Shadow enum)
    {
      pattern: /^(hover:|focus:|active:)?shadow-(sm|md|lg|xl|2xl|none)$/,
    },
    // Opacity (assuming multiples of 10 from 0 to 100)
    {
      pattern:
        /^(hover:|focus:|active:)?opacity-(0|10|20|30|40|50|60|70|80|90|100)$/,
    },
    // Overflow (using your Overflow enum)
    {
      pattern:
        /^(hover:|focus:|active:)?overflow-(visible|hidden|scroll|auto)$/,
    },
    // Visibility (using your Visibility enum)
    {
      pattern: /^(hover:|focus:|active:)?(visible|invisible)$/,
    },
    // z-index (expecting one or more digits)
    {
      pattern: /^(hover:|focus:|active:)?z-([0-9]+)$/,
    },
    // Backdrop blur (allow numbers up to two digits or bracketed values)
    {
      pattern:
        /^(hover:|focus:|active:)?backdrop-blur-((?:[0-9]|[1-9][0-9])|\[[^\]]+\])$/,
    },
    // Outline (common values, plus bracketed values)
    {
      pattern:
        /^(hover:|focus:|active:)?outline-(none|white|black|\[[^\]]+\])$/,
    },
    // Ring (numeric value up to 2 digits or bracketed)
    {
      pattern: /^(hover:|focus:|active:)?ring-((?:[0-9]{1,2})|\[[^\]]+\])$/,
    },
    // Ring color (using typical Tailwind color names or bracketed values)
    {
      pattern: /^(hover:|focus:|active:)?ring-([a-z]+-\d{3}|\[[^\]]+\])$/,
    },
    // Cursor (using your Cursor enum)
    {
      pattern:
        /^(hover:|focus:|active:)?cursor-(auto|default|pointer|wait|text|move|not-allowed)$/,
    },
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
