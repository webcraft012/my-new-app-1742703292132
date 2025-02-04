import { z } from 'zod';
import { ContainerStyles, JustifyTypes, WidthTypes } from '@webcraft/types';

export const UIElementSchema = z.lazy(() =>
  z.object({
    type: z.enum(['container', 'row', 'column', 'button', 'text']),
    children: z.array(UIElementSchema).optional(),
    props: z.object({
      className: z.string().optional(),
      width: z.nativeEnum(WidthTypes).optional(),
      justify: z.nativeEnum(JustifyTypes).optional(),
      backgroundColor: z.string().optional(),
      containerStyle: z.nativeEnum(ContainerStyles).optional(),
      shouldShowDropHelper: z.boolean().optional(),
      paddingTop: z.number().optional(),
      paddingBottom: z.number().optional(),
      paddingLeft: z.number().optional(),
      paddingRight: z.number().optional(),
      padding: z.number().optional(),
    }),
  }),
);
