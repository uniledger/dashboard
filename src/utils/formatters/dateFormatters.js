/**
 * Date formatting utilities
 */

/**
 * Format a date for display
 * @param {number|string|Date} timestamp - The timestamp or date to format
 * @param {boolean} includeTime - Whether to include the time in the formatted date
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, includeTime = false) => {
  if (!timestamp) return 'N/A';
  
  let date;
  
  // Handle Unix timestamps (seconds since epoch)
  if (typeof timestamp === 'number') {
    // Check if it's in seconds (10 digits) or milliseconds (13 digits)
    if (timestamp < 10000000000) {
      // Convert from seconds to milliseconds
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
  } else if (typeof timestamp === 'string') {
    // Try to parse as ISO date or Unix timestamp
    if (!isNaN(Number(timestamp))) {
      const num = Number(timestamp);
      if (num < 10000000000) {
        date = new Date(num * 1000);
      } else {
        date = new Date(num);
      }
    } else {
      date = new Date(timestamp);
    }
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'N/A';
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  // Format the date
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }
  
  return date.toLocaleString('en-US', options);
};