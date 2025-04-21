import axios from 'axios';
import * as cheerio from 'cheerio';

// A simple in-memory cache for documentation
const docsCache: Record<string, { content: string; timestamp: number }> = {};
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetches documentation for a library
 * 
 * @param libraryId The Context7-compatible library ID
 * @param topic Optional topic to focus the docs on
 * @param maxTokens Maximum number of tokens to return
 * @returns Documentation content
 */
export async function getLibraryDocs(
  libraryId: string,
  topic?: string,
  maxTokens: number = 5000
): Promise<string> {
  const cacheKey = `${libraryId}:${topic || 'general'}`;
  
  // Check if we have a fresh cache entry
  const now = Date.now();
  if (docsCache[cacheKey] && now - docsCache[cacheKey].timestamp < CACHE_TTL) {
    return limitTokens(docsCache[cacheKey].content, maxTokens);
  }
  
  // Parse the library ID to get the name and version
  const [name, version] = libraryId.split('@');
  
  // Fetch documentation based on the library
  let docs = '';
  
  try {
    switch (name) {
      case 'react':
        docs = await fetchReactDocs(version, topic);
        break;
      case 'nextjs':
        docs = await fetchNextJsDocs(version, topic);
        break;
      case 'vue':
        docs = await fetchVueDocs(version, topic);
        break;
      case 'express':
        docs = await fetchExpressDocs(version, topic);
        break;
      case 'node':
        docs = await fetchNodeDocs(version, topic);
        break;
      case 'typescript':
        docs = await fetchTypeScriptDocs(version, topic);
        break;
      case 'tailwindcss':
        docs = await fetchTailwindDocs(version, topic);
        break;
      default:
        // Try to fetch from npm documentation or GitHub README
        docs = await fetchGenericDocs(name, version, topic);
    }
    
    // Cache the result
    docsCache[cacheKey] = {
      content: docs,
      timestamp: now,
    };
    
    return limitTokens(docs, maxTokens);
  } catch (error) {
    console.error(`Error fetching docs for ${libraryId}:`, error);
    return `Could not fetch documentation for ${libraryId}. Please try a different library or check the library name.`;
  }
}

/**
 * Limit the number of tokens in the documentation
 */
function limitTokens(content: string, maxTokens: number): string {
  // A very simple token counting approximation (words + punctuation)
  const tokens = content.split(/\s+/).length;
  
  if (tokens <= maxTokens) {
    return content;
  }
  
  // If we need to truncate, do it at word boundaries
  const words = content.split(/\s+/);
  const truncated = words.slice(0, maxTokens).join(' ');
  
  return truncated + '\n\n[Documentation truncated due to token limit]';
}

/**
 * Fetch React documentation
 */
async function fetchReactDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://react.dev/reference/react';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'hooks':
        url = 'https://react.dev/reference/react/hooks';
        break;
      case 'components':
        url = 'https://react.dev/reference/react/components';
        break;
      case 'suspense':
        url = 'https://react.dev/reference/react/Suspense';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('main').text();
  
  // Format the content
  return `# React Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch Next.js documentation
 */
async function fetchNextJsDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://nextjs.org/docs';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'routing':
        url = 'https://nextjs.org/docs/app/building-your-application/routing';
        break;
      case 'data-fetching':
        url = 'https://nextjs.org/docs/app/building-your-application/data-fetching';
        break;
      case 'api':
        url = 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('main').text();
  
  // Format the content
  return `# Next.js Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch Vue documentation
 */
async function fetchVueDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://vuejs.org/guide/introduction.html';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'composition':
        url = 'https://vuejs.org/guide/extras/composition-api-faq.html';
        break;
      case 'components':
        url = 'https://vuejs.org/guide/essentials/component-basics.html';
        break;
      case 'reactivity':
        url = 'https://vuejs.org/guide/essentials/reactivity-fundamentals.html';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('.content').text();
  
  // Format the content
  return `# Vue.js Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch Express documentation
 */
async function fetchExpressDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://expressjs.com/en/4x/api.html';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'routing':
        url = 'https://expressjs.com/en/guide/routing.html';
        break;
      case 'middleware':
        url = 'https://expressjs.com/en/guide/using-middleware.html';
        break;
      case 'error':
        url = 'https://expressjs.com/en/guide/error-handling.html';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('#page-doc').text();
  
  // Format the content
  return `# Express.js Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch Node.js documentation
 */
async function fetchNodeDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://nodejs.org/docs/latest/api/';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'fs':
        url = 'https://nodejs.org/docs/latest/api/fs.html';
        break;
      case 'http':
        url = 'https://nodejs.org/docs/latest/api/http.html';
        break;
      case 'buffer':
        url = 'https://nodejs.org/docs/latest/api/buffer.html';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('#apicontent').text();
  
  // Format the content
  return `# Node.js Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch TypeScript documentation
 */
async function fetchTypeScriptDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://www.typescriptlang.org/docs/';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'interfaces':
        url = 'https://www.typescriptlang.org/docs/handbook/interfaces.html';
        break;
      case 'generics':
        url = 'https://www.typescriptlang.org/docs/handbook/generics.html';
        break;
      case 'types':
        url = 'https://www.typescriptlang.org/docs/handbook/basic-types.html';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('.main-content').text();
  
  // Format the content
  return `# TypeScript Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch Tailwind CSS documentation
 */
async function fetchTailwindDocs(version: string, topic?: string): Promise<string> {
  let url = 'https://tailwindcss.com/docs';
  
  if (topic) {
    // Map common topics to their documentation URLs
    switch (topic.toLowerCase()) {
      case 'colors':
        url = 'https://tailwindcss.com/docs/customizing-colors';
        break;
      case 'flex':
        url = 'https://tailwindcss.com/docs/flex';
        break;
      case 'grid':
        url = 'https://tailwindcss.com/docs/grid-template-columns';
        break;
    }
  }
  
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extract the main content
  const content = $('.prose').text();
  
  // Format the content
  return `# Tailwind CSS Documentation (v${version})

${content.trim()}

Source: ${url}`;
}

/**
 * Fetch generic documentation for any library
 */
async function fetchGenericDocs(name: string, version: string, topic?: string): Promise<string> {
  try {
    // Try to fetch from npm
    const npmUrl = `https://registry.npmjs.org/${name}`;
    const npmResponse = await axios.get(npmUrl);
    
    // Get the GitHub repository URL if available
    const repoUrl = npmResponse.data.repository?.url;
    
    if (repoUrl) {
      // Convert git URL to GitHub web URL
      const githubUrl = repoUrl
        .replace('git+', '')
        .replace('git:', 'https:')
        .replace('.git', '');
      
      // Fetch the README from GitHub
      const readmeUrl = `${githubUrl}/raw/master/README.md`;
      try {
        const readmeResponse = await axios.get(readmeUrl);
        return `# ${name} Documentation (v${version})

${readmeResponse.data}

Source: ${githubUrl}`;
      } catch (error) {
        // If README.md doesn't exist, try to fetch the repository page
        const repoResponse = await axios.get(githubUrl);
        const $ = cheerio.load(repoResponse.data);
        
        // Extract the README content
        const readmeContent = $('#readme').text();
        
        return `# ${name} Documentation (v${version})

${readmeContent.trim()}

Source: ${githubUrl}`;
      }
    } else {
      // If no repository URL, use the npm description
      return `# ${name} Documentation (v${version})

${npmResponse.data.description || 'No description available.'}

## Installation

\`\`\`
npm install ${name}
\`\`\`

Source: https://www.npmjs.com/package/${name}`;
    }
  } catch (error) {
    // If all else fails, return a generic message
    return `# ${name} Documentation (v${version})

No documentation could be found for this library. Please check the library name or try a different library.`;
  }
}
