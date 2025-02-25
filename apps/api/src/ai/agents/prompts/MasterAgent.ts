import dedent from 'dedent';
import { z } from 'zod';

export const masterAgentPrompt = dedent(`
"Given the user's prompt describing the type of app (e.g., 'rental car app'), generate a comprehensive app requirements document in JSON format. The document should include:

1. **App Name & Description:** A clear name and a detailed overview of what the app does.
2. **Use Cases:** A complete list of potential use cases. For each use case, include:
   - The use case name
   - A detailed description of the functionality
   - A step-by-step process outlining how the user would interact with that feature
   - is authentication required
3. **Additional Features:** Any extra features or functionalities (e.g., push notifications, user profile management, real-time availability) that enhance the app's usability.
4. **Examples:** Where applicable, include real-world scenarios or examples to clarify the use cases.

- Exclude the use cases of authentification, you just need to need set needs authentication or not
- Exclude the use case of contact support
The output must be valid JSON and should cover every possible use case for the app described.

Example: user request: I want a car rental app

Output:

{
  "appName": "Rental Car Hub",
  "implementAuthentication": true,
  "description": "Rental Car Hub is a mobile application that enables users to search for, compare, and book rental cars from various providers. It offers a seamless booking experience, secure payment processing, and integrated customer support.",
  "useCases": [
    {
      "name": "Search for Rental Cars",
      "description": "Allow users to search for available rental cars based on criteria like location, date, car type, and price range.",
      "steps": [
        "Enter pickup location and drop-off location.",
        "Select rental start and end dates.",
        "Apply filters such as car type, price range, or rental company.",
        "Review the list of available cars with key details."
      ],
      "requiresAuthentication": false
    },
    {
      "name": "View Car Details",
      "description": "Provide detailed information for a selected car including features, pricing, and terms.",
      "steps": [
        "Select a car from the search results.",
        "View detailed specifications, images, and rental terms.",
        "Check customer reviews and ratings.",
        "Option to save the car for later or proceed to booking."
      ],
      "requiresAuthentication": false
    },
    {
      "name": "Booking a Rental Car",
      "description": "Enable users to book a selected car for the desired rental period.",
      "steps": [
        "Select the desired car and rental period.",
        "Review booking details and rental terms.",
        "Confirm the booking details.",
        "Receive booking confirmation via email and in-app notification."
      ],
      "requiresAuthentication": true
    },
    {
      "name": "Payment Processing",
      "description": "Facilitate secure online payments for the rental booking.",
      "steps": [
        "Navigate to the payment screen after booking confirmation.",
        "Enter payment details (credit card, digital wallet, etc.).",
        "Process the transaction via a secure payment gateway.",
        "Receive a digital receipt and confirmation of the payment."
      ],
      "requiresAuthentication": true
    },
    {
      "name": "Booking Cancellation",
      "description": "Allow users to cancel a booking with clear terms on refunds or penalties.",
      "steps": [
        "Navigate to the 'My Bookings' section.",
        "Select the active booking to cancel.",
        "Review cancellation policy and potential charges.",
        "Confirm cancellation and receive a refund summary if applicable."
      ],
      "requiresAuthentication": true
    },
    {
      "name": "Review and Ratings",
      "description": "Enable users to leave feedback on their rental experience.",
      "steps": [
        "After the rental period, navigate to the booking history.",
        "Select a completed booking to review.",
        "Rate the car and service on a scale and leave written feedback.",
        "Submit the review which is then displayed for future users."
      ],
      "requiresAuthentication": true
    }
  ],
  "additionalFeatures": [
    "Push notifications for booking updates, offers, and reminders.",
    "Integration with mapping services for real-time location tracking.",
    "User profile management to save preferences and past rentals.",
    "In-app messaging for direct communication with rental providers.",
    "Multi-language support to cater to international users."
  ]
}
`);

export const appConfig = z.object({
  appName: z.string(),
  implementAuthentication: z.boolean(),
  description: z.string(),
  useCases: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      steps: z.array(z.string()),
      requiresAuthentication: z.boolean(),
    }),
  ),
  additionalFeatures: z.array(z.string()).optional(),
});
