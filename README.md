# Context7 Clone

An MCP (Model Context Protocol) server for providing up-to-date documentation for LLMs and AI code editors, inspired by [Context7](https://github.com/upstash/context7).

## Features

- Provides up-to-date documentation for popular libraries and frameworks
- Integrates with AI coding assistants via the Model Context Protocol (MCP)
- Supports topic-specific documentation retrieval
- Token limiting to fit within context windows
- Simple web interface for testing

## Getting Started

### Prerequisites

- Node.js >= 14.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/context7-clone.git
cd context7-clone
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The server will be running at http://localhost:3000.

## Usage

### Web Interface

Visit http://localhost:3000 in your browser to use the web interface for testing the documentation retrieval.

### Integration with AI Coding Assistants

#### Cursor

Add this to your `~/.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "context7-clone": {
      "command": "node",
      "args": ["path/to/context7-clone/dist/index.js"]
    }
  }
}
```

#### Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "context7-clone": {
      "command": "node",
      "args": ["path/to/context7-clone/dist/index.js"]
    }
  }
}
```

### API

The server implements the Model Context Protocol (MCP) and provides the following tools:

#### resolve-library-id

Resolves a general library name into a Context7-compatible library ID.

Parameters:
- `libraryName` (string): The name of the library to resolve

#### get-library-docs

Fetches documentation for a library using a Context7-compatible library ID.

Parameters:
- `context7CompatibleLibraryID` (string, required): The Context7-compatible library ID
- `topic` (string, optional): Focus the docs on a specific topic (e.g., "routing", "hooks")
- `tokens` (number, optional, default 5000): Max number of tokens to return

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with hot reloading enabled.

## License

MIT
