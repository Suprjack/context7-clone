import express from 'express';
import path from 'path';
import { MCPServer } from './mcp/server';
import { MCPRequest } from './types/mcp';

const app = express();
const port = process.env.PORT || 3000;
const mcpServer = new MCPServer();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MCP endpoint
app.post('/', async (req, res) => {
  try {
    const request = req.body as MCPRequest;
    console.log(`Received request: ${request.method}`);

    const response = await mcpServer.handleRequest(request);
    res.json(response);
  } catch (error: any) {
    console.error('Error handling request:', error);

    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`,
      },
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Context7 MCP server running at http://localhost:${port}`);
  console.log('Ready to provide up-to-date documentation for LLMs and AI code editors');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Context7 MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Context7 MCP server...');
  process.exit(0);
});
