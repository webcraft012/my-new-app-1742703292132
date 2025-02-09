import { z } from 'zod';

// export const UIElementSchema = z.lazy(() =>
//   z.object({
//     type: z.enum(['container', 'row', 'column', 'button', 'text']),
//     children: z.array(UIElementSchema).optional(),
//     props: z.object({
//       m: z.string().optional(),
//       mt: z.string().optional(),
//       mr: z.string().optional(),
//       mb: z.string().optional(),
//       ml: z.string().optional(),
//       mx: z.string().optional(),
//       my: z.string().optional(),
//       p: z.string().optional(),
//       pt: z.string().optional(),
//       pr: z.string().optional(),
//       pb: z.string().optional(),
//       pl: z.string().optional(),
//       px: z.string().optional(),
//       py: z.string().optional(),

//       // Typography
//       fontSize: z.string().optional(),
//       textColor: z.string().optional(),
//       fontWeight: z.string().optional(),
//       textAlign: z.string().optional(),

//       // Layout
//       display: z.string().optional(),
//       flexDirection: z.string().optional(),
//       justifyContent: z.string().optional(),
//       alignItems: z.string().optional(),
//       gap: z.string().optional(),
//       flex: z.string().optional(),
//       flexWrap: z.string().optional(),
//       flexGrow: z.string().optional(),
//       flexShrink: z.string().optional(),
//       flexBasis: z.string().optional(),

//       // Sizing
//       w: z.string().optional(),
//       h: z.string().optional(),
//       maxW: z.string().optional(),
//       minW: z.string().optional(),
//       maxH: z.string().optional(),
//       minH: z.string().optional(),

//       // Background
//       bg: z.string().optional(),

//       // Borders
//       border: z.string().optional(),
//       borderColor: z.string().optional(),
//       borderRadius: z.string().optional(),

//       // Position
//       position: z.string().optional(),
//       inset: z.string().optional(),

//       // UI Enhancements
//       shadow: z.string().optional(),
//       opacity: z.string().optional(),
//       overflow: z.string().optional(),
//       visibility: z.string().optional(),
//       rounded: z.string().optional(),
//       zIndex: z.string().optional(),
//       transform: z.string().optional(),
//       transition: z.string().optional(),
//       backdropBlur: z.string().optional(),
//       outline: z.string().optional(),
//       ring: z.string().optional(),
//       ringColor: z.string().optional(),
//       cursor: z.string().optional(),
//       disabled: z.string().optional(),
//     }),
//   }),
// );

export const UIElementSchema = z.lazy(() =>
  z.object({
    type: z.enum(['container', 'row', 'column', 'button', 'text']),
    children: z.array(UIElementSchema).optional(),
    props: z.record(z.any()), // Allows any key-value pairs
  }),
);
