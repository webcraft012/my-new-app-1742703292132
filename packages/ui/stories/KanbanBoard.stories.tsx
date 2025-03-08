import * as React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
} from "../components/composed/kanban-board";
import { Button } from "../components/ui/button";
import {
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

const meta: Meta<typeof KanbanBoard> = {
  title: "Composed/KanbanBoard",
  component: KanbanBoard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Kanban Board Component

A highly customizable drag-and-drop Kanban board component built with @hello-pangea/dnd (a maintained fork of react-beautiful-dnd).

## Features

- Drag and drop cards between columns
- Reorder columns via drag and drop
- Collapsible columns
- Custom card and column renderers
- Card and column management (add, edit, delete)
- Responsive design
- Accessible keyboard navigation
- Customizable styling
- Comprehensive callback system

## Usage

The KanbanBoard is a controlled component, meaning you need to manage the state of columns and cards yourself. 
The component provides callbacks for various actions (moving cards, adding columns, etc.) that you can use to update your state.

### Basic Example

\`\`\`tsx
import { KanbanBoard, KanbanColumn, KanbanCard } from "@/components/kanban-board";
import { useState } from "react";

function KanbanExample() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "card-1", title: "Task 1" },
        { id: "card-2", title: "Task 2" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ]);

  const handleCardMove = (
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number
  ) => {
    setColumns(prevColumns => {
      // Create a deep copy of the columns
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      
      // Find source and destination columns
      const sourceColIndex = newColumns.findIndex(col => col.id === sourceColumnId);
      const destColIndex = newColumns.findIndex(col => col.id === destinationColumnId);
      
      // Find and remove the card from the source column
      const sourceCards = newColumns[sourceColIndex].cards;
      const cardIndex = sourceCards.findIndex(card => card.id === cardId);
      const [movedCard] = sourceCards.splice(cardIndex, 1);
      
      // Add the card to the destination column at the specified index
      newColumns[destColIndex].cards.splice(newIndex, 0, movedCard);
      
      return newColumns;
    });
  };

  return (
    <KanbanBoard
      columns={columns}
      onCardMove={handleCardMove}
      onCardClick={(card) => console.log("Card clicked:", card)}
      height="600px"
    />
  );
}
\`\`\`
`,
      },
    },
  },
  argTypes: {
    columns: {
      control: "object",
      description: "The columns to display on the board",
    },
    onCardMove: {
      action: "cardMoved",
      description: "Callback when a card is dragged and dropped",
    },
    onColumnMove: {
      action: "columnMoved",
      description: "Callback when a column is dragged and dropped",
    },
    onCardClick: {
      action: "cardClicked",
      description: "Callback when a card is clicked",
    },
    onAddCard: {
      action: "addCard",
      description: "Callback when the add card button is clicked",
    },
    onAddColumn: {
      action: "addColumn",
      description: "Callback when the add column button is clicked",
    },
    onColumnCollapse: {
      action: "columnCollapsed",
      description: "Callback when a column is collapsed or expanded",
    },
    onColumnDelete: {
      action: "columnDeleted",
      description: "Callback when a column is deleted",
    },
    draggableCards: {
      control: "boolean",
      description: "Whether to allow dragging cards",
    },
    draggableColumns: {
      control: "boolean",
      description: "Whether to allow dragging columns",
    },
    showAddCardButton: {
      control: "boolean",
      description: "Whether to show the add card button",
    },
    showAddColumnButton: {
      control: "boolean",
      description: "Whether to show the add column button",
    },
    showColumnOptions: {
      control: "boolean",
      description: "Whether to show column options (edit, delete)",
    },
    collapsibleColumns: {
      control: "boolean",
      description: "Whether to allow collapsing columns",
    },
    height: {
      control: "text",
      description: "Height of the board",
    },
    showCardCount: {
      control: "boolean",
      description: "Whether to show card counts in column headers",
    },
    showColumnLimit: {
      control: "boolean",
      description: "Whether to show column limits in column headers",
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Generate sample data for the stories
function generateSampleData(): KanbanColumn[] {
  return [
    {
      id: "todo",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          title: "Research competitors",
          description:
            "Look into what our competitors are doing and identify opportunities",
          tags: [{ id: "tag-1", name: "Research", color: "blue" }],
          priority: "medium",
          assignees: [{ id: "user-1", name: "Alex Johnson" }],
        },
        {
          id: "card-2",
          title: "Design new landing page",
          description: "Create wireframes and mockups for the new landing page",
          tags: [
            { id: "tag-2", name: "Design", color: "purple" },
            { id: "tag-3", name: "Website", color: "green" },
          ],
          priority: "high",
          assignees: [
            { id: "user-2", name: "Sam Taylor" },
            { id: "user-3", name: "Jordan Lee" },
          ],
          attachments: 3,
          comments: 5,
        },
        {
          id: "card-3",
          title: "Improve page load performance",
          tags: [{ id: "tag-4", name: "Technical", color: "red" }],
          priority: "low",
        },
      ],
      limit: 5,
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [
        {
          id: "card-4",
          title: "Implement authentication flow",
          description: "Set up user registration, login, and password reset",
          tags: [
            { id: "tag-4", name: "Technical", color: "red" },
            { id: "tag-5", name: "Security", color: "yellow" },
          ],
          priority: "high",
          assignees: [{ id: "user-4", name: "Morgan Chen" }],
          comments: 3,
        },
        {
          id: "card-5",
          title: "Create component library",
          tags: [{ id: "tag-2", name: "Design", color: "purple" }],
          priority: "medium",
          assignees: [{ id: "user-2", name: "Sam Taylor" }],
        },
      ],
      limit: 3,
    },
    {
      id: "review",
      title: "Review",
      cards: [
        {
          id: "card-6",
          title: "Review copy for marketing emails",
          description: "Check grammar, messaging, and call-to-actions",
          tags: [{ id: "tag-6", name: "Marketing", color: "orange" }],
          priority: "medium",
          assignees: [
            { id: "user-5", name: "Riley Smith" },
            { id: "user-1", name: "Alex Johnson" },
          ],
          comments: 2,
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        {
          id: "card-7",
          title: "Set up CI/CD pipeline",
          tags: [{ id: "tag-4", name: "Technical", color: "red" }],
          priority: "high",
          assignees: [{ id: "user-4", name: "Morgan Chen" }],
        },
        {
          id: "card-8",
          title: "Conduct user interviews",
          description:
            "Talk to 5 potential users to gather feedback on prototype",
          tags: [
            { id: "tag-1", name: "Research", color: "blue" },
            { id: "tag-7", name: "User Experience", color: "indigo" },
          ],
          priority: "high",
          assignees: [{ id: "user-5", name: "Riley Smith" }],
          attachments: 2,
          comments: 7,
        },
      ],
      collapsed: true,
    },
  ];
}

// Basic Kanban board
export const Default: Story = {
  args: {
    columns: generateSampleData(),
    height: "600px",
  },
};

// Kanban board with custom card renderer
export const CustomCards: Story = {
  args: {
    columns: generateSampleData(),
    height: "600px",
    renderCard: (card, columnId, isDragging) => {
      // Determine priority color
      let priorityColor = "";
      let priorityIcon = null;

      if (
        card.tags?.some(
          (tag) =>
            tag.name === "High" || tag.name === "Medium" || tag.name === "Low",
        )
      ) {
        const priorityTag = card.tags.find(
          (tag) =>
            tag.name === "High" || tag.name === "Medium" || tag.name === "Low",
        );

        if (priorityTag?.name === "High") {
          priorityColor = "text-red-500";
          priorityIcon = <AlertCircle className="h-4 w-4 text-red-500" />;
        } else if (priorityTag?.name === "Medium") {
          priorityColor = "text-yellow-500";
          priorityIcon = <Clock className="h-4 w-4 text-yellow-500" />;
        } else if (priorityTag?.name === "Low") {
          priorityColor = "text-green-500";
          priorityIcon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
        }
      }

      return (
        <div className={`p-1 ${isDragging ? "opacity-50" : ""}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="font-medium">{card.title}</div>
            {priorityIcon}
          </div>

          {card.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
              {card.description}
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags
                .filter(
                  (tag) =>
                    tag.name !== "High" &&
                    tag.name !== "Medium" &&
                    tag.name !== "Low",
                )
                .map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-2 py-0 h-5"
                  >
                    {tag.name}
                  </Badge>
                ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            {card.dueDate && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {typeof card.dueDate === "string"
                  ? card.dueDate
                  : card.dueDate.toLocaleDateString()}
              </span>
            )}

            <div className="flex items-center gap-3">
              {card.comments && (
                <span className="flex items-center">{card.comments} 💬</span>
              )}

              {card.assignees && card.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {card.assignees.slice(0, 2).map((assignee) => (
                    <div
                      key={assignee.id}
                      className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs border-2 border-white dark:border-gray-700"
                      title={assignee.name}
                    >
                      {assignee.avatar ? (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        assignee.name.charAt(0)
                      )}
                    </div>
                  ))}
                  {card.assignees.length > 2 && (
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs border-2 border-white dark:border-gray-700">
                      +{card.assignees.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
};

// Kanban board with custom column headers
export const CustomColumnHeaders: Story = {
  args: {
    columns: generateSampleData().map((col) => ({
      ...col,
      color:
        col.id === "todo"
          ? "blue"
          : col.id === "in-progress"
            ? "yellow"
            : col.id === "review"
              ? "purple"
              : col.id === "done"
                ? "green"
                : undefined,
    })),
    height: "600px",
    renderColumnHeader: (column, isCollapsed) => {
      // Determine column color
      const colorMap: Record<string, string> = {
        blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
        yellow:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
        purple:
          "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
        green:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
        red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
      };

      const colorClass = column.color ? colorMap[column.color] || "" : "";

      return (
        <div
          className={`p-3 font-medium flex items-center justify-between rounded-t-lg ${colorClass}`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">{column.title}</span>
            <Badge variant="outline" className="text-xs">
              {column.cards.length}
              {column.limit ? `/${column.limit}` : ""}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {isCollapsed ? (
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    },
  },
};

// Kanban board with custom add buttons
export const CustomAddButtons: Story = {
  args: {
    columns: generateSampleData(),
    height: "600px",
    renderAddCardButton: (columnId) => (
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2 border-dashed"
        onClick={() => console.log(`Add card to column: ${columnId}`)}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    ),
    renderAddColumnButton: () => (
      <Button
        variant="default"
        className="h-12 w-full"
        onClick={() => console.log("Add column")}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Column
      </Button>
    ),
  },
};

// Kanban board with some columns collapsed
export const CollapsedColumns: Story = {
  args: {
    columns: generateSampleData().map((col) => ({
      ...col,
      collapsed: col.id === "done" || col.id === "review",
    })),
    height: "600px",
  },
};

// Kanban board with controlled state
export const ControlledBoard: Story = {
  render: () => {
    // State for columns
    const [columns, setColumns] =
      React.useState<KanbanColumn[]>(generateSampleData());

    // State for logging actions (for demonstration purposes)
    const [logs, setLogs] = React.useState<string[]>([]);
    const addLog = (message: string) => {
      setLogs((prev) => [message, ...prev].slice(0, 5));
    };

    /**
     * Handle card movement between columns or within the same column.
     *
     * This function is called when a card is dragged and dropped.
     * It updates the state to reflect the new position of the card.
     */
    const handleCardMove = (
      cardId: string,
      sourceColumnId: string,
      destinationColumnId: string,
      newIndex: number,
    ) => {
      addLog(
        `Moving card ${cardId} from ${sourceColumnId} to ${destinationColumnId} at index ${newIndex}`,
      );

      setColumns((prevColumns) => {
        // Create a deep copy of the columns to avoid mutating state directly
        const newColumns = JSON.parse(JSON.stringify(prevColumns));

        // Find the source and destination columns
        const sourceColumnIndex = newColumns.findIndex(
          (col: KanbanColumn) => col.id === sourceColumnId,
        );
        const destColumnIndex = newColumns.findIndex(
          (col: KanbanColumn) => col.id === destinationColumnId,
        );

        if (sourceColumnIndex === -1 || destColumnIndex === -1)
          return prevColumns;

        // Find the card in the source column
        const sourceColumn = newColumns[sourceColumnIndex];
        const cardIndex = sourceColumn.cards.findIndex(
          (card: KanbanCard) => card.id === cardId,
        );

        if (cardIndex === -1) return prevColumns;

        // Remove the card from the source column
        const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);

        // Add the card to the destination column at the specified index
        newColumns[destColumnIndex].cards.splice(newIndex, 0, movedCard);

        return newColumns;
      });
    };

    /**
     * Handle column reordering.
     *
     * This function is called when a column is dragged and dropped.
     * It updates the state to reflect the new order of columns.
     */
    const handleColumnMove = (columnId: string, newIndex: number) => {
      addLog(`Moving column ${columnId} to index ${newIndex}`);

      setColumns((prevColumns) => {
        // Create a copy of the columns to avoid mutating state directly
        const newColumns = [...prevColumns];

        // Find the column to move
        const columnIndex = newColumns.findIndex(
          (col: KanbanColumn) => col.id === columnId,
        );

        if (columnIndex === -1) return prevColumns;

        // Remove the column from its current position
        const [movedColumn] = newColumns.splice(columnIndex, 1);

        // Insert the column at the new position
        newColumns.splice(newIndex, 0, movedColumn);

        return newColumns;
      });
    };

    /**
     * Handle card click events.
     *
     * This function is called when a card is clicked.
     * In a real application, this might open a modal or navigate to a detail view.
     */
    const handleCardClick = (card: KanbanCard, columnId: string) => {
      addLog(`Card clicked: ${card.title} in column ${columnId}`);
      // In a real application, you might open a modal or navigate to a detail view
      // For example: setSelectedCard(card); setCardModalOpen(true);
    };

    /**
     * Handle adding a new card to a column.
     *
     * This function is called when the "Add Card" button is clicked.
     * It creates a new card and adds it to the specified column.
     */
    const handleAddCard = (columnId: string) => {
      addLog(`Adding card to column: ${columnId}`);

      setColumns((prevColumns) => {
        // Create a copy of the columns to avoid mutating state directly
        const newColumns = JSON.parse(JSON.stringify(prevColumns));

        // Find the column to add the card to
        const columnIndex = newColumns.findIndex(
          (col: KanbanColumn) => col.id === columnId,
        );

        if (columnIndex === -1) return prevColumns;

        // Create a new card with a unique ID
        const newCard: KanbanCard = {
          id: `card-${Date.now()}`,
          title: `New Card ${newColumns[columnIndex].cards.length + 1}`,
          description: "Click to edit this card",
          priority: "medium",
          tags: [{ id: `tag-${Date.now()}`, name: "New", color: "blue" }],
        };

        // Add the card to the column
        newColumns[columnIndex].cards.push(newCard);

        return newColumns;
      });
    };

    /**
     * Handle adding a new column to the board.
     *
     * This function is called when the "Add Column" button is clicked.
     * It creates a new column and adds it to the board.
     */
    const handleAddColumn = () => {
      addLog("Adding new column");

      // Create a new column with a unique ID
      const newColumn: KanbanColumn = {
        id: `column-${Date.now()}`,
        title: `New Column ${columns.length + 1}`,
        cards: [],
      };

      // Add the column to the board
      setColumns([...columns, newColumn]);
    };

    /**
     * Handle collapsing or expanding a column.
     *
     * This function is called when the collapse/expand button is clicked.
     * It updates the collapsed state of the specified column.
     */
    const handleColumnCollapse = (columnId: string, collapsed: boolean) => {
      addLog(`${collapsed ? "Collapsing" : "Expanding"} column ${columnId}`);

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId ? { ...column, collapsed } : column,
        ),
      );
    };

    /**
     * Handle deleting a column.
     *
     * This function is called when the delete button in a column header is clicked.
     * It removes the specified column from the board.
     */
    const handleColumnDelete = (columnId: string) => {
      addLog(`Deleting column: ${columnId}`);

      // Filter out the column to delete
      setColumns((prevColumns) =>
        prevColumns.filter((column) => column.id !== columnId),
      );
    };

    /**
     * Reset the board to its initial state.
     */
    const handleReset = () => {
      addLog("Resetting board to initial state");
      setColumns(generateSampleData());
    };

    return (
      <div className="w-full">
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Interactive Kanban Board</h2>
          <p className="text-sm mb-3">
            This is a fully controlled example of the KanbanBoard component. Try
            dragging cards between columns or reordering the columns themselves.
            You can also add new cards and columns, or collapse/delete existing
            columns.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <Button onClick={handleAddColumn} size="sm">
              Add Column
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset Board
            </Button>
          </div>

          {logs.length > 0 && (
            <div className="mt-3 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
              <div className="font-bold mb-1">Action Log:</div>
              {logs.map((log, i) => (
                <div key={i} className="text-xs mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        <KanbanBoard
          columns={columns}
          onCardMove={handleCardMove}
          onColumnMove={handleColumnMove}
          onCardClick={handleCardClick}
          onAddCard={handleAddCard}
          onAddColumn={handleAddColumn}
          onColumnCollapse={handleColumnCollapse}
          onColumnDelete={handleColumnDelete}
          height="600px"
          renderAddColumnButton={() => (
            <Button
              variant="outline"
              className="h-12 w-full border-dashed"
              onClick={handleAddColumn}
            >
              <span className="mr-2">+</span> Add Column
            </Button>
          )}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
## Controlled Board Example

This example demonstrates a fully controlled implementation of the KanbanBoard component with proper state management.

Key features demonstrated:
- Managing column and card state
- Handling card movement between columns
- Reordering columns
- Adding new cards and columns
- Collapsing and expanding columns
- Deleting columns
- Logging actions for demonstration purposes

This pattern can be adapted for real-world applications where you might:
- Persist changes to a backend API
- Implement undo/redo functionality
- Add validation rules for card movement
- Implement more complex card editing
`,
      },
    },
  },
};

// Kanban board with compact design
export const CompactDesign: Story = {
  args: {
    columns: generateSampleData(),
    height: "600px",
    cardClassName:
      "p-2 shadow-none border border-gray-200 dark:border-gray-700",
    columnClassName:
      "w-72 bg-gray-50 dark:bg-gray-900 shadow-none border border-gray-200 dark:border-gray-700",
  },
};

// Kanban board for a development workflow
export const DevelopmentWorkflow: Story = {
  args: {
    columns: [
      {
        id: "backlog",
        title: "Backlog",
        cards: [
          {
            id: "dev-1",
            title: "Implement user authentication",
            description: "Add OAuth support for Google and GitHub",
            tags: [
              { id: "tag-1", name: "Feature", color: "blue" },
              { id: "tag-2", name: "High", color: "red" },
            ],
            assignees: [
              {
                id: "user-1",
                name: "Alex Johnson",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
            ],
          },
          {
            id: "dev-2",
            title: "Fix responsive layout issues",
            description: "Address layout problems on mobile devices",
            tags: [
              { id: "tag-3", name: "Bug", color: "red" },
              { id: "tag-4", name: "Medium", color: "yellow" },
            ],
          },
          {
            id: "dev-3",
            title: "Optimize database queries",
            description: "Improve performance of slow queries",
            tags: [
              { id: "tag-5", name: "Enhancement", color: "green" },
              { id: "tag-6", name: "Low", color: "green" },
            ],
          },
        ],
      },
      {
        id: "todo",
        title: "To Do",
        cards: [
          {
            id: "dev-4",
            title: "Update dependencies",
            description: "Update all npm packages to latest versions",
            tags: [
              { id: "tag-7", name: "Maintenance", color: "purple" },
              { id: "tag-8", name: "Medium", color: "yellow" },
            ],
            assignees: [
              {
                id: "user-2",
                name: "Sarah Miller",
                avatar: "https://i.pravatar.cc/150?img=5",
              },
            ],
          },
        ],
      },
      {
        id: "in-progress",
        title: "In Progress",
        cards: [
          {
            id: "dev-5",
            title: "Implement dark mode",
            description: "Add dark mode support with theme toggle",
            tags: [
              { id: "tag-9", name: "Feature", color: "blue" },
              { id: "tag-10", name: "Medium", color: "yellow" },
            ],
            assignees: [
              {
                id: "user-3",
                name: "David Chen",
                avatar: "https://i.pravatar.cc/150?img=3",
              },
            ],
            comments: 3,
          },
        ],
      },
      {
        id: "testing",
        title: "Testing",
        cards: [
          {
            id: "dev-6",
            title: "Write unit tests for API",
            description: "Increase test coverage for API endpoints",
            tags: [
              { id: "tag-11", name: "Testing", color: "yellow" },
              { id: "tag-12", name: "High", color: "red" },
            ],
            assignees: [
              {
                id: "user-4",
                name: "Michael Brown",
                avatar: "https://i.pravatar.cc/150?img=4",
              },
            ],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        cards: [
          {
            id: "dev-7",
            title: "Set up CI/CD pipeline",
            description:
              "Configure GitHub Actions for automated testing and deployment",
            tags: [
              { id: "tag-13", name: "DevOps", color: "purple" },
              { id: "tag-14", name: "Done", color: "green" },
            ],
            assignees: [
              {
                id: "user-5",
                name: "Emily Wilson",
                avatar: "https://i.pravatar.cc/150?img=6",
              },
            ],
          },
        ],
      },
    ],
    height: "600px",
  },
};

export const NonDraggable: Story = {
  args: {
    columns: generateSampleData(),
    draggableCards: false,
    draggableColumns: false,
    height: "600px",
  },
};

export const NoColumnOptions: Story = {
  args: {
    columns: generateSampleData(),
    showColumnOptions: false,
    height: "600px",
  },
};

export const NonCollapsible: Story = {
  args: {
    columns: generateSampleData(),
    collapsibleColumns: false,
    height: "600px",
  },
};

export const CustomCardRenderer: Story = {
  args: {
    columns: generateSampleData(),
    height: "600px",
    renderCard: (card, columnId, isDragging) => (
      <div
        className={`p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm ${
          isDragging ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        <div className="font-bold">{card.title}</div>
        {card.description && (
          <div className="text-sm mt-1">{card.description}</div>
        )}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">ID: {card.id}</span>
          <span className="text-xs font-medium">Column: {columnId}</span>
        </div>
      </div>
    ),
  },
};
