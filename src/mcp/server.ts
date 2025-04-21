import { MCPRequest, MCPResponse, MCPInitializeParams, MCPInitializeResult } from '../types/mcp';
import { resolveLibrary } from '../services/libraryResolver';
import { getLibraryDocs } from '../services/docsService';

export class MCPServer {
  private readonly version = '1.0.0';
  private readonly name = 'Context7-Clone';

  /**
   * Handle incoming MCP requests
   */
  public async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request);
        case 'resolve-library-id':
          return this.handleResolveLibrary(request);
        case 'get-library-docs':
          return this.handleGetLibraryDocs(request);
        default:
          return this.createErrorResponse(request.id, -32601, `Method not found: ${request.method}`);
      }
    } catch (error: any) {
      return this.createErrorResponse(request.id, -32603, `Internal error: ${error.message}`);
    }
  }

  /**
   * Handle the initialize method
   */
  private handleInitialize(request: MCPRequest): MCPResponse {
    const params = request.params as MCPInitializeParams;
    console.log(`Client connected: ${params.client_name} v${params.client_version}`);

    const result: MCPInitializeResult = {
      server_info: {
        name: this.name,
        version: this.version,
      },
      capabilities: {
        tools: [
          {
            name: 'resolve-library-id',
            description: 'Resolves a general library name into a Context7-compatible library ID.',
            parameters: {
              type: 'object',
              properties: {
                libraryName: {
                  type: 'string',
                  description: 'Search and rerank results',
                },
              },
              required: ['libraryName'],
            },
          },
          {
            name: 'get-library-docs',
            description: 'Fetches documentation for a library using a Context7-compatible library ID.',
            parameters: {
              type: 'object',
              properties: {
                context7CompatibleLibraryID: {
                  type: 'string',
                  description: 'The Context7-compatible library ID',
                },
                topic: {
                  type: 'string',
                  description: 'Focus the docs on a specific topic (e.g., "routing", "hooks")',
                },
                tokens: {
                  type: 'number',
                  description: 'Max number of tokens to return',
                },
              },
              required: ['context7CompatibleLibraryID'],
            },
          },
        ],
      },
    };

    return {
      jsonrpc: '2.0',
      id: request.id,
      result,
    };
  }

  /**
   * Handle the resolve-library-id method
   */
  private async handleResolveLibrary(request: MCPRequest): Promise<MCPResponse> {
    const { libraryName } = request.params;
    
    if (!libraryName) {
      return this.createErrorResponse(request.id, -32602, 'Invalid params: libraryName is required');
    }

    const libraryId = await resolveLibrary(libraryName);
    
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: { libraryId },
    };
  }

  /**
   * Handle the get-library-docs method
   */
  private async handleGetLibraryDocs(request: MCPRequest): Promise<MCPResponse> {
    const { context7CompatibleLibraryID, topic, tokens = 5000 } = request.params;
    
    if (!context7CompatibleLibraryID) {
      return this.createErrorResponse(
        request.id,
        -32602,
        'Invalid params: context7CompatibleLibraryID is required'
      );
    }

    const docs = await getLibraryDocs(context7CompatibleLibraryID, topic, tokens);
    
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: { docs },
    };
  }

  /**
   * Create an error response
   */
  private createErrorResponse(id: string | number, code: number, message: string): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
      },
    };
  }
}
