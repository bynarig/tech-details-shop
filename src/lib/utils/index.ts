/**
 * Common utility functions for the application
 */

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2
	}).format(amount);
  }
  
  /**
   * Format a date with various options
   */
  export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	
	if (format === 'short') {
	  return dateObj.toLocaleDateString();
	}
	
	if (format === 'long') {
	  return dateObj.toLocaleString();
	}
	
	// Relative time formatting
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - dateObj.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
	const diffMinutes = Math.floor(diffTime / (1000 * 60));
	
	if (diffMinutes < 5) return 'just now';
	if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
	if (diffHours < 24) return `${diffHours} hours ago`;
	if (diffDays < 7) return `${diffDays} days ago`;
	
	return dateObj.toLocaleDateString();
  }
  
  /**
   * Generate a random ID for temporary use
   */
  export function generateId(): string {
	return Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Truncate text to a specific length
   */
  export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
  }
  
  /**
   * Get the status color class for order status
   */
  export function getOrderStatusClass(status: string): string {
	switch (status.toLowerCase()) {
	  case 'pending':
		return 'bg-yellow-100 text-yellow-800';
	  case 'processing':
		return 'bg-blue-100 text-blue-800';
	  case 'shipped':
		return 'bg-purple-100 text-purple-800';
	  case 'delivered':
		return 'bg-green-100 text-green-800';
	  case 'cancelled':
		return 'bg-red-100 text-red-800';
	  default:
		return 'bg-gray-100 text-gray-800';
	}
  }
  
  /**
   * Format a stock level with appropriate styling class
   */
  export function getStockLevelClass(quantity: number): string {
	if (quantity <= 0) return 'text-red-600';
	if (quantity < 10) return 'text-yellow-600';
	return 'text-green-600';
  }
  
  /**
   * Convert kebab-case or snake_case to Title Case
   */
  export function toTitleCase(text: string): string {
	return text
	  .replace(/[-_]/g, ' ')
	  .replace(/\w\S*/g, (word) => {
		return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
	  });
  }
  
  /**
   * Slugify a string (convert to URL-friendly format)
   */
  export function slugify(text: string): string {
	return text
	  .toString()
	  .toLowerCase()
	  .trim()
	  .replace(/\s+/g, '-')     // Replace spaces with -
	  .replace(/&/g, '-and-')   // Replace & with 'and'
	  .replace(/[^\w\-]+/g, '') // Remove all non-word characters
	  .replace(/\-\-+/g, '-');  // Replace multiple - with single -
  }