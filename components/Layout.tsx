
import React from "react";
import Head from "next/head";

 * Props for the Layout component
 *
 * @interface LayoutProps
 * @property {React.ReactNode} children - The content to render inside the layout
 * @property {string} [title] - The page title
 * @property {string} [description] - The page meta description

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

export function Layout({ children, title, description }: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen font-sans">
      <Head>
        <title>{title ? title : "To Do App"}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
}

}
