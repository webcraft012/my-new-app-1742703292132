import dedent from 'dedent';
import { z } from 'zod';

export const uiAgentPrompt = dedent(`
"Given the comprehensive app requirements document provided by the master agent, generate a detailed UI layout document in JSON format. The document should describe every major page of the app in detail. For each page, include its purpose, an in-depth description of its layout and functionality, and an array of sections that break down the content of the page. Do not include details about individual UI components; focus on the overall page structure and content.

The JSON document should include the following for each page:

1. **Page Details:**
   - **pageName:** A unique name for the page.
   - **purpose:** A clear, detailed explanation of what the page is intended to achieve within the app.
   - **description:** A thorough description outlining the layout, content, and functionality of the page. Include details about how the page fits into the overall app flow.

2. **Sections:**
   - An array of sections for the page. For each section, provide:
     - **sectionName:** A title or identifier for the section.
     - **description:** A detailed explanation of what the section contains and its role on the page.

Ensure that the output is valid JSON and that every page needed for a comprehensive app experience is covered (for example, pages for Home, Search Results, Car Details, Booking, Payment, Manage Bookings, and User Profile).

Example Output for a Car Rental App:
"{
  "pages": [
    {
      "pageName": "Home Page",
      "purpose": "Welcome users, introduce the app, and provide quick access to core functionalities such as searching for rental cars, viewing promotional offers, and navigating to other areas of the app.",
      "description": "The Home Page serves as the entry point of the app, designed to create a strong first impression with a prominent banner, clear navigation, and immediate access to search functionality. It highlights key features, current promotions, and customer testimonials to build trust and engagement.",
      "sections": [
        {
          "sectionName": "Header",
          "description": "Contains the app logo, main navigation links (Home, Search, Bookings, Profile), and login/signup call-to-action."
        },
        {
          "sectionName": "Main Banner",
          "description": "A visually engaging banner that highlights the app’s value proposition and includes a search bar overlay for quick rental car searches."
        },
        {
          "sectionName": "Promotional Offers",
          "description": "Showcases current discounts, special offers, or featured rental providers to attract user interest."
        },
        {
          "sectionName": "Testimonials",
          "description": "Displays customer reviews and success stories to build credibility and trust."
        }
      ]
    },
    {
      "pageName": "Search Results Page",
      "purpose": "Display a list of available rental cars based on user-defined criteria, allowing users to refine their search with filters and view options.",
      "description": "This page presents the search outcomes in an organized and accessible layout. It provides robust filtering options and sorting mechanisms to help users quickly find the best rental options. The design emphasizes clarity, ease-of-navigation, and quick access to detailed information.",
      "sections": [
        {
          "sectionName": "Search Filters",
          "description": "Offers various filters such as location, date range, car type, and price range to refine the search results."
        },
        {
          "sectionName": "Results List",
          "description": "Displays a list or grid of rental car summaries, including images, brief details, pricing, and a call-to-action to view more details."
        },
        {
          "sectionName": "Map View (Optional)",
          "description": "Provides an interactive map for users to visually locate available rental cars, if applicable."
        }
      ]
    },
    {
      "pageName": "Car Details Page",
      "purpose": "Offer an in-depth view of a selected rental car to help users make informed decisions before booking.",
      "description": "The Car Details Page provides comprehensive information about the chosen car, including a detailed image gallery, technical specifications, rental terms, pricing details, and customer reviews. It is designed to be both visually appealing and highly informative, ensuring users have all necessary details before proceeding with a booking.",
      "sections": [
        {
          "sectionName": "Image Gallery",
          "description": "A carousel or grid of high-resolution images showcasing the exterior, interior, and key features of the car."
        },
        {
          "sectionName": "Car Specifications",
          "description": "Lists detailed information such as performance, rental terms, pricing breakdown, and additional benefits like insurance options."
        },
        {
          "sectionName": "User Reviews",
          "description": "Displays feedback and ratings from previous users, with options to read detailed reviews or submit a new review."
        }
      ]
    },
    {
      "pageName": "Booking Page",
      "purpose": "Enable users to review their selected rental car details, input or confirm rental specifics, and prepare for the payment process.",
      "description": "The Booking Page guides users through confirming their selection and providing necessary rental details such as dates, locations, and optional services. It consolidates all booking information in a clear and concise format, ensuring that users can verify all details before moving on to payment.",
      "sections": [
        {
          "sectionName": "Booking Summary",
          "description": "Presents a detailed summary of the selected rental car, rental period, pricing breakdown, and any additional options chosen."
        },
        {
          "sectionName": "Rental Details Form",
          "description": "Allows users to enter or confirm essential rental details like pickup/drop-off locations, rental dates, and any special requests."
        },
        {
          "sectionName": "Additional Options",
          "description": "Provides choices for extra services such as insurance, GPS, or child seats, along with their respective costs."
        },
        {
          "sectionName": "Proceed to Payment CTA",
          "description": "A clear call-to-action button that directs the user to the Payment Page after confirming all booking details."
        }
      ]
    },
    {
      "pageName": "Payment Page",
      "purpose": "Facilitate a secure and user-friendly payment process to finalize the rental booking.",
      "description": "The Payment Page is focused on guiding the user through a secure payment process. It displays a comprehensive summary of charges, provides multiple payment method options, and includes clear instructions for entering billing details. The layout is optimized for trust and ease-of-use, ensuring that the user feels confident in completing the transaction.",
      "sections": [
        {
          "sectionName": "Payment Method Selection",
          "description": "Presents various payment options (credit card, digital wallet, etc.) with clear instructions and icons for each method."
        },
        {
          "sectionName": "Billing Details",
          "description": "Displays an itemized summary of the rental charges, taxes, fees, and any additional costs, along with input fields for billing information."
        },
        {
          "sectionName": "Review & Submit",
          "description": "Offers a final review of the booking details and a secure button to submit the payment and confirm the booking."
        }
      ]
    },
    {
      "pageName": "Manage Bookings Page",
      "purpose": "Allow users to view, manage, and modify their current and past rental bookings.",
      "description": "This page provides users with an organized overview of all their bookings. It enables easy access to detailed information for each booking, and offers actions such as cancellation or modification. The design is focused on clarity, with clearly labeled statuses and intuitive controls for booking management.",
      "sections": [
        {
          "sectionName": "Booking History List",
          "description": "Displays a list of all current and past bookings with essential details such as booking dates, car information, and status."
        },
        {
          "sectionName": "Booking Details",
          "description": "Shows detailed information for a selected booking, including rental period, pricing, and any special conditions or cancellation policies."
        },
        {
          "sectionName": "Action Buttons",
          "description": "Includes clear buttons for actions like modifying, canceling, or contacting support regarding a booking."
        }
      ]
    },
    {
      "pageName": "User Profile Page",
      "purpose": "Provide users with a central hub to view and manage their personal information, preferences, and account settings.",
      "description": "The User Profile Page offers a comprehensive view of the user’s account. It allows users to update personal details, view a summary of their bookings, manage notification settings, and access support or FAQs. The layout is user-centric and designed for ease of access and customization.",
      "sections": [
        {
          "sectionName": "Personal Information",
          "description": "Displays the user's profile picture, name, email, and contact details, with options to edit these details."
        },
        {
          "sectionName": "Booking Overview",
          "description": "Provides a summary of current and past bookings with quick access links to detailed booking pages."
        },
        {
          "sectionName": "Account Settings",
          "description": "Includes settings for password changes, notification preferences, and privacy options."
        }
      ]
    }
  ]
}
"
`);

export const uiConfig = z.object({
  pages: z.array(
    z.object({
      pageName: z.string(),
      purpose: z.string(),
      description: z.string(),
      sections: z.array(
        z.object({
          sectionName: z.string(),
          description: z.string(),
        }),
      ),
    }),
  ),
});
