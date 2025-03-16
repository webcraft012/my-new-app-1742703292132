# File Operation Instructions for AI Agents

This describes how to perform file operations within a project using a system of XML-like tags.

**Important Concepts:**

- **Project Root:** All file paths are relative to the root directory of the project. Think of this as the top-level folder containing all project files.
- **Line Numbers (for editing):** Line numbers start at 1 (the first line of a file is line 1). The `endLine` is _inclusive_, meaning that line will also be part of the replacement.
- **Whitespace Preservation:** The content inside the tags (especially for `<create-file>` and `<edit-file>`) will be written to the file _exactly_ as it appears, including spaces, tabs, and newlines. This is crucial for code formatting.

## Available File Operations

The following tags represent the available file operations:

| Tag             | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `<create-file>` | Creates a new file at the specified path, filling it with the provided content. |
| `<delete-file>` | Deletes the file at the specified path.                                         |
| `<edit-file>`   | Modifies an _existing_ file by replacing a specific section of lines.           |
| `<rename-file>` | Changes the name of a file, but _keeps it in the same directory_.               |
| `<move-file>`   | Moves a file from one directory to another.                                     |

## Tag Syntax and Detailed Examples

Each tag has specific attributes that provide the necessary details for the operation. Attributes are key-value pairs within the opening tag (e.g., `path="my/file.txt"`).

### 1. `<create-file>` - Create a New File

This tag creates a new file. The content between the opening and closing tags becomes the file's content.

- **`path` (required):** The file path, relative to the project root, where the new file should be created. This includes the file name and extension.

**Syntax:**
Example 1: Create a React Component

<create-file path="src/components/Greeting.tsx">
import React from 'react';

interface GreetingProps {
name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
return <h1>Hello, {name}!</h1>;
};

export default Greeting;
</create-file>

Example 2: Create a JSON Data File
<create-file path="data/users.json">
{
"users": [
{ "id": 1, "name": "Alice" },
{ "id": 2, "name": "Bob" }
]
}
</create-file>

### 2. <delete-file> - Delete an Existing File

This tag deletes a file.
path (required): The file path, relative to the project root, of the file to be deleted.
Syntax: <delete-file path="path/to/file/to/delete.ext"></delete-file>

### 3. <edit-file> - Modify an Existing File

This tag replaces a range of lines within an existing file. It's crucial that the file already exists.
path (required): The file path, relative to the project root, of the file to be edited.
startLine (required): The line number (starting from 1) where the replacement begins.
endLine (required): The line number (starting from 1) where the replacement ends (inclusive).
Example: Update a Function in a JavaScript File
Let's say src/utils/calculator.js currently contains:

function add(a, b) {
// Old implementation
return a - b;
}

function multiply(a, b) {
return a \* b;
}

To replace the old add implementation
<edit-file path="src/utils/calculator.js" startLine="2" endLine="4">
function add(a, b) {
return a + b;
}
</edit-file>

**_Example to insert a new method_**
<edit-file path="src/utils/User.js" startLine="9" endLine="9">
getFormattedEmail() {
return this.email.toLowerCase();
}
}

export default User;
</edit-file>

### 4. <rename-file> - Rename a File

This tag renames a file, keeping it within the same directory.
oldPath (required): The current file path, relative to the project root.
newPath (required): The new file path, relative to the project root. Only the filename part should be different.
Syntax: <rename-file oldPath="path/to/old_name.ext" newPath="path/to/new_name.ext"></rename-file>

### 5. <move-file> - Move a File

This tag moves a file to a different directory.
oldPath (required): The current file path, relative to the project root.
newPath (required): The new file path, relative to the project root, including the desired directory.
Syntax: <move-file oldPath="old/path/to/file.ext" newPath="new/path/to/file.ext"></move-file>
