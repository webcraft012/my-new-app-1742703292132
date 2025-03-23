import React from "react";

/**
 * Props for the Layout component
 *
 * @interface LayoutProps
 * @property {React.ReactNode} children - The content to render inside the layout
 * @property {string} [title] - The page title
 * @property {string} [description] - The page meta description
 */
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * Layout component that wraps all pages
 *
 * Provides consistent page structure with head metadata
 *
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} The layout component
 */
export function Layout({ children }: LayoutProps): JSX.Element {
  return <div className="min-h-screen font-sans">{children}</div>;
}
