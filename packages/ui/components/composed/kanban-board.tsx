"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Plus,
  MoreHorizontal,
  X,
  Grip,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

// Custom drag layer styles to prevent jumping and ensure cursor alignment
const getItemStyle = (
  isDragging: boolean,
  draggableStyle: any,
  isColumn: boolean = false,
  isCollapsed: boolean = false,
) => {
  // When not dragging, just use the provided style with some base styles
  if (!isDragging) {
    return {
      userSelect: "none" as const,
      ...(isColumn && {
        height: isCollapsed ? "auto" : "100%",
      }),
      ...draggableStyle,
    };
  }

  // When dragging, we need to ensure the cursor stays aligned with the item
  return {
    // Base styles
    userSelect: "none" as const,

    // Important: Keep the transform from the library but don't add position: fixed
    // This allows the library to handle positioning relative to the cursor
    ...draggableStyle,

    // Visual enhancements for dragging
    zIndex: 9999,
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.15)",
    opacity: 0.9,

    // Remove any transition to ensure immediate response to cursor movement
    transition: "none",
  };
};

// Types
export interface KanbanCard {
  /** Unique identifier for the card */
  id: string;
  /** Title or main text of the card */
  title: string;
  /** Optional longer description of the card content */
  description?: string;
  /** Optional array of tags/labels to categorize the card */
  tags?: Array<{
    /** Unique identifier for the tag */
    id: string;
    /** Display name of the tag */
    name: string;
    /** Optional color for styling the tag (e.g., "blue", "red", "green") */
    color?: string;
  }>;
  /** Optional due date for the card task */
  dueDate?: string | Date;
  /** Optional array of users assigned to the card */
  assignees?: Array<{
    /** Unique identifier for the assignee */
    id: string;
    /** Display name of the assignee */
    name: string;
    /** Optional URL to the assignee's avatar image */
    avatar?: string;
  }>;
  /** Optional priority level of the card */
  priority?: "low" | "medium" | "high";
  /** Optional count of attachments on the card */
  attachments?: number;
  /** Optional count of comments on the card */
  comments?: number;
  /** Optional additional data associated with the card */
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  /** Unique identifier for the column */
  id: string;
  /** Display title of the column */
  title: string;
  /** Array of cards contained in this column */
  cards: KanbanCard[];
  /** Optional maximum number of cards allowed in this column */
  limit?: number;
  /** Optional color for styling the column (e.g., "blue", "red", "green") */
  color?: string;
  /** Optional additional data associated with the column */
  metadata?: Record<string, any>;
  /** Whether the column is currently collapsed (cards hidden) */
  collapsed?: boolean;
}

export interface KanbanBoardProps {
  /**
   * Array of columns to display on the board.
   * Each column must have a unique id, title, and an array of cards.
   * Example:
   * ```
   * [
   *   {
   *     id: "todo",
   *     title: "To Do",
   *     cards: [
   *       { id: "card-1", title: "Task 1" },
   *       { id: "card-2", title: "Task 2" }
   *     ]
   *   },
   *   {
   *     id: "in-progress",
   *     title: "In Progress",
   *     cards: []
   *   }
   * ]
   * ```
   */
  columns: KanbanColumn[];

  /**
   * Callback fired when a card is dragged and dropped.
   *
   * @param cardId - The unique ID of the card being moved
   * @param sourceColumnId - The ID of the column the card is moving from
   * @param destinationColumnId - The ID of the column the card is moving to
   * @param newIndex - The new position index in the destination column
   *
   * The consumer should update their state based on these parameters.
   *
   * Example implementation:
   * ```
   * const handleCardMove = (cardId, sourceColumnId, destinationColumnId, newIndex) => {
   *   setColumns(prevColumns => {
   *     const newColumns = [...prevColumns];
   *
   *     // Find source and destination columns
   *     const sourceColIndex = newColumns.findIndex(col => col.id === sourceColumnId);
   *     const destColIndex = newColumns.findIndex(col => col.id === destinationColumnId);
   *
   *     // Find the card in the source column
   *     const sourceCards = [...newColumns[sourceColIndex].cards];
   *     const cardIndex = sourceCards.findIndex(card => card.id === cardId);
   *     const [movedCard] = sourceCards.splice(cardIndex, 1);
   *
   *     // Insert the card in the destination column
   *     const destCards = [...newColumns[destColIndex].cards];
   *     destCards.splice(newIndex, 0, movedCard);
   *
   *     // Update the columns
   *     newColumns[sourceColIndex].cards = sourceCards;
   *     newColumns[destColIndex].cards = destCards;
   *
   *     return newColumns;
   *   });
   * };
   * ```
   */
  onCardMove?: (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => void;

  /**
   * Callback fired when a column is dragged and dropped to a new position.
   *
   * @param columnId - The unique ID of the column being moved
   * @param newIndex - The new position index of the column in the columns array
   *
   * The consumer should update their state based on these parameters.
   *
   * Example implementation:
   * ```
   * const handleColumnMove = (columnId, newIndex) => {
   *   setColumns(prevColumns => {
   *     const newColumns = [...prevColumns];
   *     const columnIndex = newColumns.findIndex(col => col.id === columnId);
   *     const [movedColumn] = newColumns.splice(columnIndex, 1);
   *     newColumns.splice(newIndex, 0, movedColumn);
   *     return newColumns;
   *   });
   * };
   * ```
   */
  onColumnMove?: (columnId: string, newIndex: number) => void;

  /**
   * Callback fired when a card is clicked.
   * Typically used to open a modal or navigate to a detailed view of the card.
   *
   * @param card - The complete card object that was clicked
   * @param columnId - The ID of the column containing the card
   *
   * Example implementation:
   * ```
   * const handleCardClick = (card, columnId) => {
   *   setSelectedCard(card);
   *   setIsCardModalOpen(true);
   * };
   * ```
   */
  onCardClick?: (card: KanbanCard, columnId: string) => void;

  /**
   * Callback fired when the "Add Card" button is clicked in a column.
   *
   * @param columnId - The ID of the column where the card should be added
   *
   * Example implementation:
   * ```
   * const handleAddCard = (columnId) => {
   *   setColumns(prevColumns => {
   *     const newColumns = [...prevColumns];
   *     const columnIndex = newColumns.findIndex(col => col.id === columnId);
   *
   *     const newCard = {
   *       id: `card-${Date.now()}`,
   *       title: "New Card",
   *     };
   *
   *     newColumns[columnIndex].cards.push(newCard);
   *     return newColumns;
   *   });
   * };
   * ```
   */
  onAddCard?: (columnId: string) => void;

  /**
   * Callback fired when the "Add Column" button is clicked.
   *
   * Example implementation:
   * ```
   * const handleAddColumn = () => {
   *   setColumns(prevColumns => [
   *     ...prevColumns,
   *     {
   *       id: `column-${Date.now()}`,
   *       title: "New Column",
   *       cards: []
   *     }
   *   ]);
   * };
   * ```
   */
  onAddColumn?: () => void;

  /**
   * Callback fired when a column is collapsed or expanded.
   *
   * @param columnId - The ID of the column being collapsed/expanded
   * @param collapsed - The new collapsed state (true = collapsed, false = expanded)
   *
   * Example implementation:
   * ```
   * const handleColumnCollapse = (columnId, collapsed) => {
   *   setColumns(prevColumns =>
   *     prevColumns.map(col =>
   *       col.id === columnId ? { ...col, collapsed } : col
   *     )
   *   );
   * };
   * ```
   */
  onColumnCollapse?: (columnId: string, collapsed: boolean) => void;

  /**
   * Callback fired when a column title is edited.
   * Note: The default implementation doesn't provide UI for this,
   * but the callback is available for custom column header renderers.
   *
   * @param columnId - The ID of the column being edited
   * @param title - The new title for the column
   *
   * Example implementation:
   * ```
   * const handleColumnEdit = (columnId, title) => {
   *   setColumns(prevColumns =>
   *     prevColumns.map(col =>
   *       col.id === columnId ? { ...col, title } : col
   *     )
   *   );
   * };
   * ```
   */
  onColumnEdit?: (columnId: string, title: string) => void;

  /**
   * Callback fired when a column is deleted.
   *
   * @param columnId - The ID of the column to delete
   *
   * Example implementation:
   * ```
   * const handleColumnDelete = (columnId) => {
   *   setColumns(prevColumns =>
   *     prevColumns.filter(col => col.id !== columnId)
   *   );
   * };
   * ```
   */
  onColumnDelete?: (columnId: string) => void;

  /**
   * Whether cards can be dragged and dropped.
   * When false, cards will be rendered without drag handles and cannot be moved.
   * @default true
   */
  draggableCards?: boolean;

  /**
   * Whether columns can be dragged and dropped to reorder them.
   * When false, columns will be rendered without drag handles and cannot be reordered.
   * @default true
   */
  draggableColumns?: boolean;

  /**
   * Whether to show the "Add Card" button at the bottom of each column.
   * @default true
   */
  showAddCardButton?: boolean;

  /**
   * Whether to show the "Add Column" button at the right side of the board.
   * @default true
   */
  showAddColumnButton?: boolean;

  /**
   * Whether to show column options (e.g., delete button).
   * @default true
   */
  showColumnOptions?: boolean;

  /**
   * Whether columns can be collapsed to hide their cards.
   * @default true
   */
  collapsibleColumns?: boolean;

  /**
   * Custom renderer for cards. Allows complete customization of card appearance.
   *
   * @param card - The card object to render
   * @param columnId - The ID of the column containing the card
   * @param isDragging - Whether the card is currently being dragged
   * @returns React node to render for the card
   *
   * Example implementation:
   * ```
   * const renderCard = (card, columnId, isDragging) => (
   *   <div className={`custom-card ${isDragging ? 'dragging' : ''}`}>
   *     <h3>{card.title}</h3>
   *     {card.description && <p>{card.description}</p>}
   *     {card.tags && (
   *       <div className="tags">
   *         {card.tags.map(tag => (
   *           <span key={tag.id} className={`tag ${tag.color}`}>{tag.name}</span>
   *         ))}
   *       </div>
   *     )}
   *   </div>
   * );
   * ```
   */
  renderCard?: (
    card: KanbanCard,
    columnId: string,
    isDragging: boolean,
  ) => React.ReactNode;

  /**
   * Custom renderer for column headers. Allows complete customization of column header appearance.
   *
   * @param column - The column object to render the header for
   * @param isCollapsed - Whether the column is currently collapsed
   * @returns React node to render for the column header
   *
   * Example implementation:
   * ```
   * const renderColumnHeader = (column, isCollapsed) => (
   *   <div className="custom-column-header">
   *     <h2 style={{ color: column.color }}>{column.title}</h2>
   *     <div className="column-actions">
   *       <button onClick={() => handleColumnCollapse(column.id, !isCollapsed)}>
   *         {isCollapsed ? 'Expand' : 'Collapse'}
   *       </button>
   *       <button onClick={() => handleColumnDelete(column.id)}>Delete</button>
   *     </div>
   *   </div>
   * );
   * ```
   */
  renderColumnHeader?: (
    column: KanbanColumn,
    isCollapsed: boolean,
  ) => React.ReactNode;

  /**
   * Custom renderer for the "Add Card" button.
   *
   * @param columnId - The ID of the column where the button is rendered
   * @returns React node to render for the add card button
   *
   * Example implementation:
   * ```
   * const renderAddCardButton = (columnId) => (
   *   <button
   *     className="custom-add-card-button"
   *     onClick={() => handleAddCard(columnId)}
   *   >
   *     + New Task
   *   </button>
   * );
   * ```
   */
  renderAddCardButton?: (columnId: string) => React.ReactNode;

  /**
   * Custom renderer for the "Add Column" button.
   *
   * @returns React node to render for the add column button
   *
   * Example implementation:
   * ```
   * const renderAddColumnButton = () => (
   *   <button
   *     className="custom-add-column-button"
   *     onClick={handleAddColumn}
   *   >
   *     + New Column
   *   </button>
   * );
   * ```
   */
  renderAddColumnButton?: () => React.ReactNode;

  /**
   * Additional CSS classes to apply to the board container.
   * Useful for custom styling or layout adjustments.
   */
  className?: string;

  /**
   * Additional CSS classes to apply to each column.
   * Useful for custom styling of columns.
   */
  columnClassName?: string;

  /**
   * Additional CSS classes to apply to each card.
   * Useful for custom styling of cards.
   */
  cardClassName?: string;

  /**
   * Height of the board. Can be any valid CSS height value.
   * @default "calc(100vh - 120px)"
   */
  height?: string;

  /**
   * Whether to show the card count badge in column headers.
   * @default true
   */
  showCardCount?: boolean;

  /**
   * Whether to show column limits in the card count badge (if defined).
   * For example, "3/5" indicates 3 cards out of a limit of 5.
   * @default true
   */
  showColumnLimit?: boolean;
}

/**
 * A highly customizable Kanban board component that doesn't handle logic internally.
 *
 * @example
 * ```tsx
 * const [columns, setColumns] = useState<KanbanColumn[]>([
 *   {
 *     id: "todo",
 *     title: "To Do",
 *     cards: [
 *       { id: "card-1", title: "Task 1" },
 *       { id: "card-2", title: "Task 2" },
 *     ],
 *   },
 *   {
 *     id: "in-progress",
 *     title: "In Progress",
 *     cards: [
 *       { id: "card-3", title: "Task 3" },
 *     ],
 *   },
 *   {
 *     id: "done",
 *     title: "Done",
 *     cards: [],
 *   },
 * ]);
 *
 * const handleCardMove = (cardId, sourceColumnId, destinationColumnId, newIndex) => {
 *   // Update your state here
 * };
 *
 * <KanbanBoard
 *   columns={columns}
 *   onCardMove={handleCardMove}
 *   onCardClick={(card) => console.log("Card clicked:", card)}
 *   onAddCard={(columnId) => console.log("Add card to column:", columnId)}
 * />
 * ```
 */
export function KanbanBoard({
  columns,
  onCardMove,
  onColumnMove,
  onCardClick,
  onAddCard,
  onAddColumn,
  onColumnCollapse,
  onColumnEdit,
  onColumnDelete,
  draggableCards = true,
  draggableColumns = true,
  showAddCardButton = true,
  showAddColumnButton = true,
  showColumnOptions = true,
  collapsibleColumns = true,
  renderCard,
  renderColumnHeader,
  renderAddCardButton,
  renderAddColumnButton,
  className,
  columnClassName,
  cardClassName,
  height = "calc(100vh - 120px)",
  showCardCount = true,
  showColumnLimit = true,
}: KanbanBoardProps) {
  // State to track if we're currently dragging
  const [isDragging, setIsDragging] = React.useState(false);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
    // Add a class to the body to indicate dragging (useful for global styles)
    document.body.classList.add("kanban-dragging");
  };

  // Handle drag end event from react-beautiful-dnd
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    document.body.classList.remove("kanban-dragging");

    const { source, destination, type, draggableId } = result;

    // Dropped outside the list or no change
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Handle column reordering
    if (type === "COLUMN" && onColumnMove) {
      onColumnMove(draggableId, destination.index);
      return;
    }

    // Handle card movement
    if (type === "CARD" && onCardMove) {
      onCardMove(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index,
      );
    }
  };

  // Handle column collapse toggle
  const handleColumnCollapseToggle = (
    columnId: string,
    currentState: boolean,
  ) => {
    if (onColumnCollapse) {
      onColumnCollapse(columnId, !currentState);
    }
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      // This helps screen readers and improves accessibility
      dragHandleUsageInstructions="Press space bar to start dragging. Use arrow keys to move and space bar again to drop."
    >
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            className={cn(
              "flex gap-4 overflow-x-auto p-4",
              isDragging && "cursor-grabbing",
              className,
            )}
            style={{ height, minHeight: height }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((column, columnIndex) => (
              <Draggable
                key={column.id}
                draggableId={column.id}
                index={columnIndex}
                isDragDisabled={!draggableColumns}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg w-80 shrink-0",
                      snapshot.isDragging && "shadow-lg ring-2 ring-primary/20",
                      columnClassName,
                    )}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                      true,
                      !!column.collapsed,
                    )}
                  >
                    {/* Column Header */}
                    {renderColumnHeader ? (
                      renderColumnHeader(column, !!column.collapsed)
                    ) : (
                      <div
                        className={cn(
                          "p-3 font-medium flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative",
                          draggableColumns &&
                            "cursor-grab active:cursor-grabbing",
                        )}
                        {...(draggableColumns ? provided.dragHandleProps : {})}
                      >
                        {/* Visual indicator for draggable columns */}
                        {draggableColumns && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                            <div className="w-4 h-4 flex flex-col justify-center items-center opacity-50">
                              <div className="w-3 h-0.5 bg-current mb-0.5 rounded-full"></div>
                              <div className="w-3 h-0.5 bg-current mb-0.5 rounded-full"></div>
                              <div className="w-3 h-0.5 bg-current rounded-full"></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 ml-5">
                          <span>{column.title}</span>
                          {showCardCount && (
                            <Badge variant="outline" className="text-xs">
                              {column.cards.length}
                              {showColumnLimit && column.limit
                                ? `/${column.limit}`
                                : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {collapsibleColumns && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleColumnCollapseToggle(
                                  column.id,
                                  !!column.collapsed,
                                )
                              }
                            >
                              {column.collapsed ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronUp className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {showColumnOptions && (
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  // This would typically open a dropdown menu
                                  // For simplicity, we'll just handle delete directly
                                  if (
                                    onColumnDelete &&
                                    window.confirm("Delete this column?")
                                  ) {
                                    onColumnDelete(column.id);
                                  }
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Column Content */}
                    {!column.collapsed && (
                      <ScrollArea className="flex-1 p-2">
                        <Droppable droppableId={column.id} type="CARD">
                          {(provided) => (
                            <div
                              className="space-y-2"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {column.cards.map((card, cardIndex) => (
                                <Draggable
                                  key={card.id}
                                  draggableId={card.id}
                                  index={cardIndex}
                                  isDragDisabled={!draggableCards}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm relative",
                                        snapshot.isDragging &&
                                          "shadow-lg ring-2 ring-primary/20",
                                        cardClassName,
                                      )}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style,
                                        false,
                                        !!column.collapsed,
                                      )}
                                      onClick={(e) => {
                                        // Only trigger click if we're not clicking on the drag handle
                                        if (
                                          !(e.target as HTMLElement).closest(
                                            ".card-drag-handle",
                                          )
                                        ) {
                                          onCardClick?.(card, column.id);
                                        }
                                      }}
                                    >
                                      {/* Custom card renderer */}
                                      {renderCard ? (
                                        renderCard(
                                          card,
                                          column.id,
                                          snapshot.isDragging,
                                        )
                                      ) : (
                                        <>
                                          {/* Drag handle - make it span the entire top of the card */}
                                          {draggableCards && (
                                            <div
                                              {...provided.dragHandleProps}
                                              className="card-drag-handle absolute top-0 left-0 right-0 h-8 cursor-move"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <div className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <Grip className="h-3 w-3" />
                                              </div>
                                            </div>
                                          )}

                                          {/* Card content - add top padding to accommodate the drag handle */}
                                          <div className="pr-6 pt-4">
                                            {/* Card title */}
                                            <h3 className="font-medium text-sm">
                                              {card.title}
                                            </h3>

                                            {/* Card description */}
                                            {card.description && (
                                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                {card.description}
                                              </p>
                                            )}

                                            {/* Card tags */}
                                            {card.tags &&
                                              card.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                  {card.tags.map((tag) => (
                                                    <Badge
                                                      key={tag.id}
                                                      variant="outline"
                                                      className={cn(
                                                        "text-xs px-1.5 py-0 h-5",
                                                        tag.color &&
                                                          `bg-${tag.color}-100 dark:bg-${tag.color}-900 text-${tag.color}-800 dark:text-${tag.color}-300 border-${tag.color}-200 dark:border-${tag.color}-800`,
                                                      )}
                                                    >
                                                      {tag.name}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              )}

                                            {/* Card footer */}
                                            <div className="flex justify-between items-center mt-3">
                                              {/* Priority */}
                                              {card.priority && (
                                                <Badge
                                                  variant={
                                                    card.priority === "high"
                                                      ? "destructive"
                                                      : card.priority ===
                                                          "medium"
                                                        ? "secondary"
                                                        : "outline"
                                                  }
                                                  className="text-xs px-1.5 py-0 h-5"
                                                >
                                                  {card.priority}
                                                </Badge>
                                              )}

                                              {/* Assignees */}
                                              {card.assignees &&
                                                card.assignees.length > 0 && (
                                                  <div className="flex -space-x-2">
                                                    {card.assignees
                                                      .slice(0, 3)
                                                      .map((assignee) => (
                                                        <div
                                                          key={assignee.id}
                                                          className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs border-2 border-white dark:border-gray-700 overflow-hidden"
                                                          title={assignee.name}
                                                        >
                                                          {assignee.avatar ? (
                                                            <img
                                                              src={
                                                                assignee.avatar
                                                              }
                                                              alt={
                                                                assignee.name
                                                              }
                                                              className="h-full w-full object-cover"
                                                            />
                                                          ) : (
                                                            assignee.name.charAt(
                                                              0,
                                                            )
                                                          )}
                                                        </div>
                                                      ))}
                                                    {card.assignees.length >
                                                      3 && (
                                                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs border-2 border-white dark:border-gray-700">
                                                        +
                                                        {card.assignees.length -
                                                          3}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}

                              {/* Add Card Button */}
                              {showAddCardButton && !column.collapsed && (
                                <div className="pt-2">
                                  {renderAddCardButton ? (
                                    renderAddCardButton(column.id)
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                      onClick={() => onAddCard?.(column.id)}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add a card
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Add Column Button */}
            {showAddColumnButton && (
              <div className="shrink-0 w-80">
                {renderAddColumnButton ? (
                  renderAddColumnButton()
                ) : (
                  <Button
                    variant="outline"
                    className="h-12 w-full border-dashed"
                    onClick={onAddColumn}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
