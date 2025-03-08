import * as React from "react";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  X,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  Check,
} from "lucide-react";

export interface FilterOption {
  /** ID of the filter option */
  id: string;
  /** Label to display */
  label: string;
  /** Whether the option is currently selected */
  selected?: boolean;
  /** Optional badge count to display */
  count?: number;
  /** Optional group this filter belongs to */
  group?: string;
}

export interface SortOption {
  /** Value of the sort option */
  value: string;
  /** Label to display */
  label: string;
}

export interface ViewOption {
  /** Value of the view option */
  value: string;
  /** Label to display */
  label: string;
  /** Icon to display */
  icon: React.ReactNode;
}

export interface SearchFilterProps {
  /** Current search query */
  searchQuery?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Handler for search input changes */
  onSearchChange?: (value: string) => void;
  /** Handler for search submission */
  onSearchSubmit?: (value: string) => void;
  /** Whether to show the search input */
  showSearch?: boolean;

  /** Available filter options */
  filterOptions?: FilterOption[];
  /** Handler for filter option selection */
  onFilterChange?: (filterId: string, selected: boolean) => void;
  /** Handler for clearing all filters */
  onClearFilters?: () => void;
  /** Whether to show the filter section */
  showFilters?: boolean;
  /** Custom label for the filter section */
  filterLabel?: string;
  /** Whether to group filters by their group property */
  groupFilters?: boolean;
  /** Whether to show filter options as badges instead of checkboxes */
  filterAsBadges?: boolean;
  /** Whether to show the filter count badges */
  showFilterCounts?: boolean;
  /** Whether to collapse the filter section by default */
  filtersCollapsed?: boolean;

  /** Available sort options */
  sortOptions?: SortOption[];
  /** Current sort value */
  currentSort?: string;
  /** Handler for sort changes */
  onSortChange?: (value: string) => void;
  /** Whether to show the sort dropdown */
  showSort?: boolean;
  /** Custom label for the sort dropdown */
  sortLabel?: string;

  /** Available view options */
  viewOptions?: ViewOption[];
  /** Current view value */
  currentView?: string;
  /** Handler for view changes */
  onViewChange?: (value: string) => void;
  /** Whether to show the view toggle */
  showViewToggle?: boolean;

  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the search input */
  searchClassName?: string;
  /** Additional CSS classes for the filters section */
  filtersClassName?: string;
  /** Additional CSS classes for the sort section */
  sortClassName?: string;
  /** Additional CSS classes for the view toggle */
  viewToggleClassName?: string;

  /** Layout direction: 'row' or 'column' */
  layout?: "row" | "column";
  /** Whether to make the component responsive */
  responsive?: boolean;
  /** Whether to use a compact design */
  compact?: boolean;
  /** Custom children to render in the component */
  children?: React.ReactNode;
}

export function SearchFilter({
  searchQuery = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  onSearchSubmit,
  showSearch = true,

  filterOptions = [],
  onFilterChange,
  onClearFilters,
  showFilters = true,
  filterLabel = "Filters",
  groupFilters = false,
  filterAsBadges = false,
  showFilterCounts = true,
  filtersCollapsed = false,

  sortOptions = [],
  currentSort,
  onSortChange,
  showSort = true,
  sortLabel = "Sort by",

  viewOptions = [
    { value: "grid", label: "Grid", icon: <LayoutGrid className="h-4 w-4" /> },
    { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
  ],
  currentView = "grid",
  onViewChange,
  showViewToggle = true,

  className,
  searchClassName,
  filtersClassName,
  sortClassName,
  viewToggleClassName,

  layout = "row",
  responsive = true,
  compact = false,
  children,
}: SearchFilterProps) {
  // Local state for search input (controlled by parent through props)
  const [searchInputValue, setSearchInputValue] = React.useState(searchQuery);

  // Local state for filter collapse
  const [isFilterExpanded, setIsFilterExpanded] =
    React.useState(!filtersCollapsed);

  // Update local state when props change
  React.useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    onSearchChange?.(value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchInputValue);
  };

  // Group filter options if needed
  const groupedFilters = React.useMemo(() => {
    if (!groupFilters) return { ungrouped: filterOptions };

    return filterOptions.reduce<Record<string, FilterOption[]>>(
      (acc, filter) => {
        const group = filter.group || "ungrouped";
        if (!acc[group]) acc[group] = [];
        acc[group].push(filter);
        return acc;
      },
      {},
    );
  }, [filterOptions, groupFilters]);

  // Check if any filters are selected
  const hasActiveFilters = filterOptions.some((filter) => filter.selected);

  // Determine if any filters are available
  const hasFilters = filterOptions.length > 0;

  // Determine if any sort options are available
  const hasSortOptions = sortOptions.length > 0;

  // Determine container classes based on layout and responsive props
  const containerClasses = cn(
    "w-full",
    layout === "row"
      ? "flex flex-wrap items-center gap-4"
      : "flex flex-col gap-4",
    responsive && layout === "row" && "flex-col sm:flex-row",
    compact ? "p-2" : "p-4",
    className,
  );

  // Render filter options as either badges or checkboxes
  const renderFilterOptions = (filters: FilterOption[]) => {
    if (filterAsBadges) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant={filter.selected ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                filter.selected ? "bg-primary" : "hover:bg-muted",
              )}
              onClick={() => onFilterChange?.(filter.id, !filter.selected)}
            >
              {filter.label}
              {showFilterCounts && filter.count !== undefined && (
                <span className="ml-1 text-xs">({filter.count})</span>
              )}
              {filter.selected && (
                <X
                  className="ml-1 h-3 w-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange?.(filter.id, false);
                  }}
                />
              )}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2 mt-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${filter.id}`}
              checked={filter.selected}
              onCheckedChange={(checked) =>
                onFilterChange?.(filter.id, checked === true)
              }
            />
            <Label
              htmlFor={`filter-${filter.id}`}
              className="text-sm cursor-pointer flex items-center"
            >
              {filter.label}
              {showFilterCounts && filter.count !== undefined && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({filter.count})
                </span>
              )}
            </Label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* Search Input */}
      {showSearch && (
        <div
          className={cn(
            "flex-1 min-w-[200px]",
            layout === "row" ? "w-full sm:w-auto" : "w-full",
            searchClassName,
          )}
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchInputValue}
              onChange={handleSearchChange}
              className="pr-8"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && hasFilters && (
        <div
          className={cn(
            "flex-1",
            layout === "row" ? "w-full sm:w-auto" : "w-full",
            filtersClassName,
          )}
        >
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto font-medium"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {filterLabel}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {filterOptions.filter((f) => f.selected).length}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs h-auto py-1"
              >
                Clear all
              </Button>
            )}
          </div>

          {isFilterExpanded && (
            <div className="mt-2">
              {Object.entries(groupedFilters).map(([group, filters]) => (
                <div key={group} className="mb-3 last:mb-0">
                  {group !== "ungrouped" && groupFilters && (
                    <h4 className="text-sm font-medium mb-1">{group}</h4>
                  )}
                  {renderFilterOptions(filters)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-2 ml-auto",
          layout === "column" && "self-end",
        )}
      >
        {/* Sort Dropdown */}
        {showSort && hasSortOptions && (
          <div className={sortClassName}>
            <div className="flex items-center gap-2">
              {!compact && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {sortLabel}
                </span>
              )}
              <Select value={currentSort} onValueChange={onSortChange}>
                <SelectTrigger
                  className={cn(
                    "w-[140px]",
                    compact && "w-[120px] h-8 text-xs",
                  )}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* View Toggle */}
        {showViewToggle && viewOptions.length > 1 && (
          <div className={viewToggleClassName}>
            <ToggleGroup
              type="single"
              value={currentView}
              onValueChange={(value) => {
                if (value) onViewChange?.(value);
              }}
              className={cn("border rounded-md", compact && "h-8")}
            >
              {viewOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                  className={cn(
                    "data-[state=on]:bg-muted",
                    compact && "h-8 w-8 p-0",
                  )}
                >
                  {option.icon}
                  {!compact && (
                    <span className="ml-2 text-sm">{option.label}</span>
                  )}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>

      {/* Custom children */}
      {children}
    </div>
  );
}
