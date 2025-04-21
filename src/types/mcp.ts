/**
 * Types for the Model Context Protocol (MCP)
 */

export interface MCPRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
    }>;
    required?: string[];
  };
}

export interface MCPInitializeParams {
  client_name: string;
  client_version: string;
}

export interface MCPInitializeResult {
  server_info: {
    name: string;
    version: string;
  };
  capabilities: {
    tools: MCPToolDefinition[];
  };
}

export interface LibraryDocsParams {
  context7CompatibleLibraryID: string;
  topic?: string;
  tokens?: number;
}

export interface ResolveLibraryParams {
  libraryName: string;
}
