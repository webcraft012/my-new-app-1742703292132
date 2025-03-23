import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

/**
 * Home component - Main landing page of the application
 *
 * This is a simple example of a Next.js page with client-side interaction.
 * It shows a text and a button that triggers an API call.
 *
 * @returns {JSX.Element} The rendered page
 */
export default function Home(): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Fetches data from the API endpoint when the button is clicked
   * Displays the result from the API call
   */
  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch("/api/hello");
      const data = await response.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error fetching data");
    }
  };

  return (
    <Layout
      title="Next.js Example"
      description="A minimal Next.js example with pages router"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Next.js 14 with Pages Router
        </h1>

        <p className="mb-6 text-center">
          This is a minimal example demonstrating a simple page with a button
          that calls an API endpoint.
        </p>

        <div className="flex flex-col gap-4">
          <Button onClick={fetchData} className="w-full">
            Call API
          </Button>

          {message && (
            <div className="p-4 rounded bg-muted overflow-auto max-h-40">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
