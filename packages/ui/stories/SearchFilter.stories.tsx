import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchFilter } from "../components/composed/search-filter";
import {
  LayoutGrid,
  List,
  Columns,
  Grid,
  Calendar,
  Clock,
  Star,
  ArrowUpDown,
  ArrowDownUp,
} from "lucide-react";

const meta: Meta<typeof SearchFilter> = {
  title: "Composed/SearchFilter",
  component: SearchFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# SearchFilter Component

A highly customizable search and filter component that focuses purely on UI presentation, leaving the logic to be handled by the parent component.

## Features

- Search input with customizable placeholder and handlers
- Filter options that can be displayed as checkboxes or badges
- Support for grouped filters
- Sort dropdown with customizable options
- View toggle for switching between different layouts
- Responsive design with row or column layouts
- Compact mode for space-constrained UIs

## Usage Example

\`\`\`jsx
<SearchFilter
  searchQuery={searchQuery}
  onSearchChange={handleSearchChange}
  onSearchSubmit={handleSearchSubmit}
  
  filterOptions={[
    { id: "category1", label: "Category 1", selected: true, count: 12 },
    { id: "category2", label: "Category 2", count: 8 },
    { id: "category3", label: "Category 3", count: 5 },
  ]}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  
  sortOptions={[
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name", label: "Name" },
  ]}
  currentSort="newest"
  onSortChange={handleSortChange}
  
  viewOptions={[
    { value: "grid", label: "Grid", icon: <GridIcon /> },
    { value: "list", label: "List", icon: <ListIcon /> },
  ]}
  currentView="grid"
  onViewChange={handleViewChange}
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    searchQuery: {
      control: "text",
      description: "Current search query",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    onSearchChange: {
      action: "searchChanged",
      description: "Handler for search input changes",
    },
    onSearchSubmit: {
      action: "searchSubmitted",
      description: "Handler for search submission",
    },
    showSearch: {
      control: "boolean",
      description: "Whether to show the search input",
    },

    filterOptions: {
      control: "object",
      description: "Available filter options",
    },
    onFilterChange: {
      action: "filterChanged",
      description: "Handler for filter option selection",
    },
    onClearFilters: {
      action: "filtersCleared",
      description: "Handler for clearing all filters",
    },
    showFilters: {
      control: "boolean",
      description: "Whether to show the filter section",
    },
    filterLabel: {
      control: "text",
      description: "Custom label for the filter section",
    },
    groupFilters: {
      control: "boolean",
      description: "Whether to group filters by their group property",
    },
    filterAsBadges: {
      control: "boolean",
      description:
        "Whether to show filter options as badges instead of checkboxes",
    },
    showFilterCounts: {
      control: "boolean",
      description: "Whether to show the filter count badges",
    },
    filtersCollapsed: {
      control: "boolean",
      description: "Whether to collapse the filter section by default",
    },

    sortOptions: {
      control: "object",
      description: "Available sort options",
    },
    currentSort: {
      control: "text",
      description: "Current sort value",
    },
    onSortChange: {
      action: "sortChanged",
      description: "Handler for sort changes",
    },
    showSort: {
      control: "boolean",
      description: "Whether to show the sort dropdown",
    },
    sortLabel: {
      control: "text",
      description: "Custom label for the sort dropdown",
    },

    viewOptions: {
      control: "object",
      description: "Available view options",
    },
    currentView: {
      control: "text",
      description: "Current view value",
    },
    onViewChange: {
      action: "viewChanged",
      description: "Handler for view changes",
    },
    showViewToggle: {
      control: "boolean",
      description: "Whether to show the view toggle",
    },

    layout: {
      control: { type: "radio", options: ["row", "column"] },
      description: "Layout direction: 'row' or 'column'",
    },
    responsive: {
      control: "boolean",
      description: "Whether to make the component responsive",
    },
    compact: {
      control: "boolean",
      description: "Whether to use a compact design",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchFilter>;

// Sample data for stories
const sampleFilterOptions = [
  { id: "category1", label: "Category 1", selected: true, count: 12 },
  { id: "category2", label: "Category 2", count: 8 },
  { id: "category3", label: "Category 3", count: 5 },
  { id: "category4", label: "Category 4", count: 3 },
];

const sampleGroupedFilterOptions = [
  { id: "type1", label: "Type 1", selected: true, count: 10, group: "Types" },
  { id: "type2", label: "Type 2", count: 7, group: "Types" },
  { id: "type3", label: "Type 3", count: 4, group: "Types" },
  { id: "color1", label: "Color 1", count: 8, group: "Colors" },
  { id: "color2", label: "Color 2", selected: true, count: 6, group: "Colors" },
  { id: "color3", label: "Color 3", count: 3, group: "Colors" },
  { id: "size1", label: "Size 1", count: 9, group: "Sizes" },
  { id: "size2", label: "Size 2", count: 5, group: "Sizes" },
];

const sampleSortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

const sampleViewOptions = [
  { value: "grid", label: "Grid", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
  { value: "columns", label: "Columns", icon: <Columns className="h-4 w-4" /> },
  { value: "compact", label: "Compact", icon: <Grid className="h-4 w-4" /> },
];

// Basic example with all features
export const Default: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search items...",
    showSearch: true,

    filterOptions: sampleFilterOptions,
    showFilters: true,
    filterLabel: "Filters",
    groupFilters: false,
    filterAsBadges: false,
    showFilterCounts: true,
    filtersCollapsed: false,

    sortOptions: sampleSortOptions,
    currentSort: "newest",
    showSort: true,
    sortLabel: "Sort by",

    viewOptions: sampleViewOptions.slice(0, 2),
    currentView: "grid",
    showViewToggle: true,

    layout: "row",
    responsive: true,
    compact: false,
  },
};

// Search only
export const SearchOnly: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search products...",
    showSearch: true,
    showFilters: false,
    showSort: false,
    showViewToggle: false,
  },
  parameters: {
    docs: {
      description: {
        story: "A minimal configuration with only the search input visible.",
      },
    },
  },
};

// Filters as badges
export const FilterBadges: Story = {
  args: {
    showSearch: true,
    filterOptions: sampleFilterOptions,
    showFilters: true,
    filterLabel: "Categories",
    filterAsBadges: true,
    showFilterCounts: true,
    showSort: false,
    showViewToggle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displaying filter options as interactive badges instead of checkboxes.",
      },
    },
  },
};

// Grouped filters
export const GroupedFilters: Story = {
  args: {
    showSearch: true,
    filterOptions: sampleGroupedFilterOptions,
    showFilters: true,
    filterLabel: "Filters",
    groupFilters: true,
    filterAsBadges: false,
    showFilterCounts: true,
    showSort: true,
    sortOptions: sampleSortOptions,
    currentSort: "newest",
    showViewToggle: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Filters organized into groups based on their 'group' property.",
      },
    },
  },
};

// Multiple view options
export const MultipleViewOptions: Story = {
  args: {
    showSearch: false,
    showFilters: false,
    showSort: true,
    sortOptions: sampleSortOptions,
    currentSort: "newest",
    viewOptions: sampleViewOptions,
    currentView: "grid",
    showViewToggle: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Multiple view options with custom icons.",
      },
    },
  },
};

// Column layout
export const ColumnLayout: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search...",
    showSearch: true,

    filterOptions: sampleFilterOptions,
    showFilters: true,
    filterLabel: "Filters",
    filterAsBadges: true,

    sortOptions: sampleSortOptions,
    currentSort: "newest",
    showSort: true,

    viewOptions: sampleViewOptions.slice(0, 2),
    currentView: "grid",
    showViewToggle: true,

    layout: "column",
    responsive: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Vertical layout with components stacked on top of each other.",
      },
    },
  },
};

// Compact mode
export const CompactMode: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search...",
    showSearch: true,

    filterOptions: sampleFilterOptions,
    showFilters: true,
    filterLabel: "Filters",
    filterAsBadges: true,

    sortOptions: sampleSortOptions,
    currentSort: "newest",
    showSort: true,

    viewOptions: sampleViewOptions.slice(0, 2),
    currentView: "grid",
    showViewToggle: true,

    layout: "row",
    responsive: true,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact mode with reduced spacing and smaller controls.",
      },
    },
  },
};

// E-commerce example
export const EcommerceExample: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search products...",
    showSearch: true,

    filterOptions: [
      {
        id: "category_clothing",
        label: "Clothing",
        selected: true,
        count: 124,
        group: "Categories",
      },
      { id: "category_shoes", label: "Shoes", count: 87, group: "Categories" },
      {
        id: "category_accessories",
        label: "Accessories",
        count: 56,
        group: "Categories",
      },

      { id: "brand_nike", label: "Nike", count: 45, group: "Brands" },
      { id: "brand_adidas", label: "Adidas", count: 38, group: "Brands" },
      { id: "brand_puma", label: "Puma", count: 29, group: "Brands" },
      { id: "brand_reebok", label: "Reebok", count: 22, group: "Brands" },

      { id: "size_s", label: "Small", count: 67, group: "Sizes" },
      {
        id: "size_m",
        label: "Medium",
        selected: true,
        count: 89,
        group: "Sizes",
      },
      { id: "size_l", label: "Large", count: 76, group: "Sizes" },
      { id: "size_xl", label: "X-Large", count: 45, group: "Sizes" },

      { id: "color_black", label: "Black", count: 56, group: "Colors" },
      { id: "color_white", label: "White", count: 48, group: "Colors" },
      { id: "color_red", label: "Red", count: 32, group: "Colors" },
      {
        id: "color_blue",
        label: "Blue",
        selected: true,
        count: 29,
        group: "Colors",
      },
    ],
    showFilters: true,
    filterLabel: "Filter Products",
    groupFilters: true,
    filterAsBadges: false,
    showFilterCounts: true,

    sortOptions: [
      { value: "popular", label: "Most Popular" },
      { value: "newest", label: "Newest Arrivals" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "rating", label: "Customer Rating" },
    ],
    currentSort: "popular",
    showSort: true,
    sortLabel: "Sort by",

    viewOptions: [
      {
        value: "grid",
        label: "Grid",
        icon: <LayoutGrid className="h-4 w-4" />,
      },
      { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
    ],
    currentView: "grid",
    showViewToggle: true,

    layout: "row",
    responsive: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A complete e-commerce product filtering example with categories, brands, sizes, and colors.",
      },
    },
  },
};

// Content library example
export const ContentLibraryExample: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search content...",
    showSearch: true,

    filterOptions: [
      {
        id: "type_article",
        label: "Articles",
        selected: true,
        count: 45,
        group: "Content Type",
      },
      { id: "type_video", label: "Videos", count: 32, group: "Content Type" },
      {
        id: "type_podcast",
        label: "Podcasts",
        count: 18,
        group: "Content Type",
      },
      { id: "type_ebook", label: "E-Books", count: 12, group: "Content Type" },

      {
        id: "topic_tech",
        label: "Technology",
        selected: true,
        count: 37,
        group: "Topics",
      },
      { id: "topic_business", label: "Business", count: 29, group: "Topics" },
      { id: "topic_design", label: "Design", count: 24, group: "Topics" },
      { id: "topic_marketing", label: "Marketing", count: 17, group: "Topics" },

      { id: "date_today", label: "Today", count: 5, group: "Date" },
      { id: "date_week", label: "This Week", count: 18, group: "Date" },
      { id: "date_month", label: "This Month", count: 42, group: "Date" },
      { id: "date_year", label: "This Year", count: 87, group: "Date" },
    ],
    showFilters: true,
    filterLabel: "Filter Content",
    groupFilters: true,
    filterAsBadges: true,
    showFilterCounts: true,

    sortOptions: [
      { value: "recent", label: "Most Recent" },
      { value: "popular", label: "Most Popular" },
      { value: "trending", label: "Trending" },
      { value: "title", label: "Title A-Z" },
    ],
    currentSort: "recent",
    showSort: true,
    sortLabel: "Sort by",

    viewOptions: [
      {
        value: "grid",
        label: "Grid",
        icon: <LayoutGrid className="h-4 w-4" />,
      },
      { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
      {
        value: "compact",
        label: "Compact",
        icon: <Grid className="h-4 w-4" />,
      },
    ],
    currentView: "grid",
    showViewToggle: true,

    layout: "row",
    responsive: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A content library example with content types, topics, and date filters.",
      },
    },
  },
};

// Dashboard example
export const DashboardExample: Story = {
  args: {
    searchQuery: "",
    searchPlaceholder: "Search reports...",
    showSearch: true,

    filterOptions: [
      { id: "status_active", label: "Active", selected: true, count: 12 },
      { id: "status_pending", label: "Pending", count: 5 },
      { id: "status_archived", label: "Archived", count: 8 },
    ],
    showFilters: true,
    filterLabel: "Status",
    groupFilters: false,
    filterAsBadges: true,
    showFilterCounts: true,

    sortOptions: [
      { value: "recent", label: "Most Recent" },
      { value: "name", label: "Name" },
    ],
    currentSort: "recent",
    showSort: true,
    sortLabel: "Sort",

    viewOptions: [
      {
        value: "cards",
        label: "Cards",
        icon: <LayoutGrid className="h-4 w-4" />,
      },
      { value: "table", label: "Table", icon: <List className="h-4 w-4" /> },
    ],
    currentView: "cards",
    showViewToggle: true,

    layout: "row",
    responsive: true,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A compact dashboard example with status filters and minimal controls.",
      },
    },
  },
};

// Interactive example with state
export const InteractiveExample: Story = {
  render: () => {
    // Local state for the interactive example
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filters, setFilters] = React.useState([
      { id: "category1", label: "Category 1", selected: true, count: 12 },
      { id: "category2", label: "Category 2", selected: false, count: 8 },
      { id: "category3", label: "Category 3", selected: false, count: 5 },
    ]);
    const [currentSort, setCurrentSort] = React.useState("newest");
    const [currentView, setCurrentView] = React.useState("grid");

    // Handlers
    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
    };

    const handleSearchSubmit = (value: string) => {
      console.log("Search submitted:", value);
    };

    const handleFilterChange = (filterId: string, selected: boolean) => {
      setFilters(
        filters.map((filter) =>
          filter.id === filterId ? { ...filter, selected } : filter,
        ),
      );
    };

    const handleClearFilters = () => {
      setFilters(filters.map((filter) => ({ ...filter, selected: false })));
    };

    return (
      <div className="space-y-4">
        <SearchFilter
          searchQuery={searchQuery}
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          filterOptions={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          sortOptions={sampleSortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          viewOptions={[
            {
              value: "grid",
              label: "Grid",
              icon: <LayoutGrid className="h-4 w-4" />,
            },
            {
              value: "list",
              label: "List",
              icon: <List className="h-4 w-4" />,
            },
          ]}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <div className="p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Current State:</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Search Query:</strong> {searchQuery || "(empty)"}
            </p>
            <p>
              <strong>Active Filters:</strong>{" "}
              {filters
                .filter((f) => f.selected)
                .map((f) => f.label)
                .join(", ") || "None"}
            </p>
            <p>
              <strong>Sort:</strong> {currentSort}
            </p>
            <p>
              <strong>View:</strong> {currentView}
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "A fully interactive example with working state management.",
      },
    },
  },
};
