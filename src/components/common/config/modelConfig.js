/**
 * Model configuration utilities
 */
import React from 'react';

/**
 * Helper utility to determine if a field is numeric and needs right-alignment
 * @param {string} fieldName - The field name to check
 * @returns {boolean} - Whether this is a numeric field
 */
export const isNumericField = (fieldName) => {
  const numericFields = [
    'amount',
    'balance',
    'count',
    'total',
    'fee',
    'rate',
    'price',
    'value',
    'quantity',
    'duration',
    'size',
    'weight',
    'length',
    'width',
    'height',
    'volume'
  ];

  // Check if the field name matches any numeric fields exactly
  if (numericFields.includes(fieldName.toLowerCase())) {
    return true;
  }

  // Check if the field name ends with common numeric suffixes
  const numericSuffixes = [
    '_amount',
    '_balance',
    '_count',
    '_total',
    '_fee',
    '_rate',
    '_price',
    '_value',
    '_quantity',
    '_duration',
    '_size',
    '_weight',
    '_length',
    '_width',
    '_height',
    '_volume'
  ];

  if (numericSuffixes.some(suffix => fieldName.toLowerCase().endsWith(suffix))) {
    return true;
  }

  // Check if the field name contains numeric words
  const numericWords = [
    'amount',
    'balance',
    'count',
    'total',
    'fee',
    'rate',
    'price',
    'value',
    'quantity',
    'duration',
    'size',
    'weight',
    'length',
    'width',
    'height',
    'volume'
  ];

  if (numericWords.some(word => fieldName.toLowerCase().includes(word))) {
    return true;
  }

  return false;
};

/**
 * Helper to format content for detail cards, applying correct styling for numeric values
 * @param {*} content - The content to format
 * @param {string} fieldName - The field name for context
 * @returns {*} - Formatted content
 */
export const formatDetailContent = (content, fieldName) => {
  // If it's a number and the field name doesn't contain 'id', format with decimal places
  if (typeof content === 'number' && !fieldName.toLowerCase().includes('id')) {
    return (
      <div className="text-right">
        {content.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </div>
    );
  }
  
  // If it's a string but represents a numeric field, right-align it
  if (typeof content === 'string' && isNumericField(fieldName)) {
    return <div className="text-right">{content}</div>;
  }
  
  // Otherwise return as-is
  return content;
};