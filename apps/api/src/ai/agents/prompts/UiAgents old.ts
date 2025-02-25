import dedent from 'dedent';
import { z } from 'zod';

export const uiAgentPrompt = dedent(`
"Using the comprehensive app requirements document provided below (which includes the app name, description, use cases, and additional features), generate a detailed UI layout plan for the app. Your task is to list every page the app will need and describe the layout and sections of each page thoroughly. For each page, include:

Exclude login and signup pages.

If a page can handle multiple use cases, please make only one page for all of them, do not make a page for each use case if they can be handled on the same page.

1. **Page Name:** A clear and concise name for the page (e.g., Home, Search Results, Car Details, Booking Confirmation, etc.).
2. **Description:** A detailed overview of the page's purpose and what the user can achieve on that page.
3. **Sections:** For each page, list all the sections/components that make up the page. For each section, provide:
   - **Section Name:** A descriptive name (e.g., Header, Footer, Content Area, Sidebar, Form Section, etc.).
   - **Content Description:** A detailed explanation of what is contained in the section, including any interactive elements, dynamic data, or specific functionalities.
4. **Navigation Elements (Optional):** List any navigation links or buttons specific to that page.
5. **Interactivity (Optional):** Describe any dynamic behavior or interactive features (e.g., carousels, modals, dropdowns) that are expected on the page.

Ensure that your output is valid JSON and covers every page required by the app based on the given use cases and additional features.

Example Output for a Car Rental App:
{
  "pages": [
    {
      "pageName": "Home",
      "description": "The landing page that introduces the app, highlights featured rental options, and provides primary navigation.",
      "sections": [
        {
          "sectionName": "Header",
          "content": "Includes the app logo, main navigation menu, and a search bar for quick access to rental searches."
        },
        {
          "sectionName": "Featured Cars",
          "content": "A carousel showcasing highlighted rental cars along with key details such as price and availability."
        },
        {
          "sectionName": "Promotions",
          "content": "Displays current offers and discounts available on rentals."
        }
      ]
    },
    {
      "pageName": "Search Results",
      "description": "Displays rental car options based on the user’s search criteria.",
      "sections": [
        {
          "sectionName": "Filter Sidebar",
          "content": "Provides options to filter search results by car type, price, rental company, etc."
        },
        {
          "sectionName": "Results List",
          "content": "A detailed list of available rental cars with brief information and links to view more details."
        }
      ]
    },
    {
      "pageName": "Car Details",
      "description": "Provides an in-depth view of a selected rental car, including images, specifications, and rental terms.",
      "sections": [
        {
          "sectionName": "Image Gallery",
          "content": "Displays multiple images of the car in a carousel or grid layout."
        },
        {
          "sectionName": "Specifications",
          "content": "Lists detailed information about the car’s features, pricing, and rental conditions."
        },
        {
          "sectionName": "Booking Call-to-Action",
          "content": "A prominent button or form section for initiating the booking process."
        }
      ]
    },
    {
      "pageName": "Booking Confirmation",
      "description": "Shows a summary of the booking details and confirms the reservation.",
      "sections": [
        {
          "sectionName": "Booking Summary",
          "content": "Displays details of the selected car, rental period, and total cost."
        },
        {
          "sectionName": "Payment Section",
          "content": "Provides a secure form for entering payment details, if required."
        }
      ]
    },
    {
      "pageName": "User Profile",
      "description": "Allows users to manage their account, view past bookings, and update personal information.",
      "sections": [
        {
          "sectionName": "Account Information",
          "content": "Displays personal details and provides options for editing user data."
        },
        {
          "sectionName": "Booking History",
          "content": "Lists previous and upcoming bookings with options to view further details."
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
      description: z.string(),
      sections: z.array(
        z.object({
          sectionName: z.string(),
          content: z.string(),
        }),
      ),
    }),
  ),
});
