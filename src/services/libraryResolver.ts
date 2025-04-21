import axios from 'axios';

// A simple in-memory cache for library mappings
const libraryCache: Record<string, string> = {
  'react': 'react@18.2.0',
  'next.js': 'nextjs@14.0.0',
  'nextjs': 'nextjs@14.0.0',
  'vue': 'vue@3.3.4',
  'angular': 'angular@17.0.0',
  'express': 'express@4.18.2',
  'node': 'node@20.0.0',
  'typescript': 'typescript@5.2.2',
  'tailwind': 'tailwindcss@3.3.3',
  'tailwindcss': 'tailwindcss@3.3.3',
};

/**
 * Resolves a general library name into a Context7-compatible library ID
 * 
 * @param libraryName The name of the library to resolve
 * @returns A Context7-compatible library ID
 */
export async function resolveLibrary(libraryName: string): Promise<string> {
  // Check if we have a cached mapping
  const normalizedName = libraryName.toLowerCase().trim();
  if (libraryCache[normalizedName]) {
    return libraryCache[normalizedName];
  }

  try {
    // Try to fetch the latest version from npm
    const response = await axios.get(`https://registry.npmjs.org/${normalizedName}/latest`);
    const version = response.data.version;
    const libraryId = `${normalizedName}@${version}`;
    
    // Cache the result
    libraryCache[normalizedName] = libraryId;
    
    return libraryId;
  } catch (error) {
    // If we can't find it on npm, just return the name as-is
    return `${normalizedName}@latest`;
  }
}
