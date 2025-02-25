export interface Agent {
  execute: (input?: string) => Promise<string>;
}

export interface AppRequirements {
  appName: string;
  /**
   * Raw user prompt/description
   * Example: "I need a car rental app with auth and booking management"
   */
  description: string;

  /**
   * Detailed list of user stories/use cases
   * Derived from analysis of the description
   */
  useCases: UseCase[];

  /**
   * Authentication requirements (if any)
   * Just a flag - details handled by Auth Agent
   */
  authentication?: string;

  /**
   * Data entities mentioned in prompt
   * Specific schema details handled by Schema Agent
   */
  dataEntities?: string[];
}

export interface UseCase {
  /**
   * Actor initiating the use case
   * Example: "User", "Admin", "Guest"
   */
  actor: string;

  /**
   * Verb describing the action
   * Example: "book", "search", "manage"
   */
  action: string;

  /**
   * Direct object of the action
   * Example: "a car", "user profile", "booking"
   */
  target: string;

  /**
   * Acceptance criteria in Gherkin-style format
   * Example:
   * "Given a logged-in user, when they select dates, then show available cars"
   */
  acceptanceCriteria: string[];
}

export interface PageRequirement {
  /**
   * Page identifier/name
   * Example: "login" | "car-search" | "booking-confirmation"
   */
  name: string;

  /**
   * Brief purpose description from user prompt
   * Example: "Page for users to search available cars"
   */
  description: string;

  /**
   * Optional high-level functionality requirements
   * Example: ["Date picker", "Price filter", "Map view"]
   */
  features?: string[];
}

export interface PageUI {
  name: string;
  path: string;
  components: UIElement;
}

export interface UIElement {
  type: 'container' | 'row' | 'column' | 'button' | 'text';
  children: UIElement[];
  props: Record<string, any>;
  text: string;
}
