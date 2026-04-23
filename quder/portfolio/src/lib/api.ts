// API base URL - can be overridden by environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface PortfolioContent {
  id?: number;
  locale: string;
  content: string;
  updatedAt?: string;
}

/**
 * Fetch portfolio content from server
 */
export async function fetchContent(locale: string): Promise<PortfolioContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/content/${locale}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch content from server:', error);
    return null;
  }
}

/**
 * Save portfolio content to server
 */
export async function saveContent(locale: string, content: any): Promise<PortfolioContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locale,
        content: JSON.stringify(content),
      }),
    });
    
    if (!response.ok) throw new Error('Failed to save content');
    return await response.json();
  } catch (error) {
    console.error('Failed to save content to server:', error);
    return null;
  }
}

/**
 * Check if server is available
 */
export async function isServerAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/health`);
    return response.ok;
  } catch {
    return false;
  }
}
