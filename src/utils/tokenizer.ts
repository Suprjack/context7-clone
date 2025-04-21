/**
 * A simple utility for estimating token counts
 * 
 * This is a very rough approximation. In a production environment,
 * you would want to use a proper tokenizer like GPT-2/3 tokenizer.
 */

/**
 * Estimate the number of tokens in a string
 * 
 * @param text The text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  // A very simple approximation: count words and punctuation
  // This is not accurate but gives a rough estimate
  return text.split(/\s+/).length;
}

/**
 * Truncate text to a maximum number of tokens
 * 
 * @param text The text to truncate
 * @param maxTokens Maximum number of tokens
 * @returns Truncated text
 */
export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const tokens = text.split(/\s+/);
  
  if (tokens.length <= maxTokens) {
    return text;
  }
  
  return tokens.slice(0, maxTokens).join(' ') + 
    '\n\n[Content truncated due to token limit]';
}
