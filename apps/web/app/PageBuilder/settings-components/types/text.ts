export enum TextTypes {
  Parahraph = "p",
  Heading1 = "h1",
  Heading2 = "h2",
  Heading3 = "h3",
  Heading4 = "h4",
  Heading5 = "h5",
  Heading6 = "h6",
  Title = "title",
  Subtitle = "subtitle",
  Caption = "caption",
  Quote = "quote",
}

export interface TextTypeOption {
  label: string;
  value: TextTypes;
  class: string;
}

export const textTypesOptions: TextTypeOption[] = [
  {
    class: "text-base",
    label: "Paragraph",
    value: TextTypes.Parahraph,
  },
  {
    class: "text-5xl",
    label: "Heading 1",
    value: TextTypes.Heading1,
  },
  {
    class: "text-4xl",
    label: "Heading 2",
    value: TextTypes.Heading2,
  },
  {
    class: "text-3xl",
    label: "Heading 3",
    value: TextTypes.Heading3,
  },
  {
    class: "text-2xl",
    label: "Heading 4",
    value: TextTypes.Heading4,
  },
  {
    class: "text-xl",
    label: "Heading 5",
    value: TextTypes.Heading5,
  },
  {
    class: "text-lg",
    label: "Heading 6",
    value: TextTypes.Heading6,
  },
  {
    class: "text-3xl",
    label: "Title",
    value: TextTypes.Title,
  },
  {
    class: "text-2xl italic text-gray-500",
    label: "Subtitle",
    value: TextTypes.Subtitle,
  },
  {
    class: "text-sm text-gray-500",
    label: "Caption",
    value: TextTypes.Caption,
  },
  {
    class: "italic text-lg font-semibold my-4 p-4 border-l-4 border-gray-400",
    label: "Quote",
    value: TextTypes.Quote,
  },
];
