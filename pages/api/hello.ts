import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Data structure returned by the API
 */
export type HelloResponse = {
  message: string;
  timestamp: string;
};

/**
 * API handler function for the /api/hello endpoint
 *
 * This is a simple example of a Next.js API route that returns
 * a JSON response with a message and the current timestamp.
 *
 * @param {NextApiRequest} req - The HTTP request object
 * @param {NextApiResponse<HelloResponse>} res - The HTTP response object
 * @returns {void}
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloResponse>
): void {
  // Return a simple response with the current time
  res.status(200).json({
    message: "Hello from Next.js API!",
    timestamp: new Date().toISOString(),
  });
}
