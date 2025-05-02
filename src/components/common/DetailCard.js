import React from 'react';
import { formatDetailContent, isNumericField } from './config/modelConfig';

/**
 * Reusable detail card component for showing entity, ledger, account, etc. details
 * Compact grid layout with optional title section and grid of properties
 * @param {Object} props - Component props
 * @param {string|null} props.title - Card title (model name) or null to hide
 * @param {string|null} props.subtitle - Card subtitle (instance name) or null to hide
 * @param {Array} props.sections - Array of section objects with label and content
 * @param {Array} props.childrenSections - Array of child sections (like tables) to display below basic info
 * @param {React.ReactNode} props.actions - Optional action buttons to display
 * @returns {JSX.Element} - Rendered component
 */
const DetailCard = ({ title, subtitle, sections, childrenSections = [], actions }) => {
  // Filter basic fields vs complex table sections
  const basicSections = [];
  const tableSections = [];
  
  // Process main sections
  sections.forEach((section) => {
    // Check if this section contains complex content like tables
    const hasTableContent = 
      section.content && 
      typeof section.content === 'object' &&
      React.isValidElement(section.content) &&
      (
        section.content.type === 'table' ||
        section.content.props?.className?.includes('overflow-x-auto') ||
        section.content.props?.children?.type === 'table' ||
        (section.content.props?.children && 
         React.isValidElement(section.content.props.children) && 
         section.content.props.children.type === 'table')
      );
    
    // Skip 'Name' fields only if we're showing a subtitle
    const isNameField = 
      subtitle && (
        section.label === 'Name' || 
        section.label?.toLowerCase() === 'name' || 
        section.label?.includes('Name')
      );
    
    if (hasTableContent) {
      tableSections.push(section);
    } else if (!isNameField) { 
      // Add to basic sections if not a name field (or if we have no subtitle)
      basicSections.push(section);
    }
  });
  
  // Add all children sections to tableSections
  tableSections.push(...childrenSections);
  
  return (
    <div>
      {/* Header section with title and actions - only show if we have a title/subtitle or actions */}
      {(title || subtitle || actions) && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 flex justify-between items-center">
            {(title || subtitle) && (
              <div>
                {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
                {subtitle && <p className="mt-1 text-base text-gray-600">{subtitle}</p>}
              </div>
            )}
            {actions && (
              <div className={`flex space-x-3 ${!title && !subtitle ? 'ml-auto' : ''}`}>
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Basic fields in compact grid */}
      {basicSections.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-gray-100">
            {basicSections.map((section, index) => (
              <div 
                key={`basic-section-${index}`}
                className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {section.label}
                </p>
                <div className={`text-sm text-gray-900 ${isNumericField(section.label) ? 'text-right' : ''}`}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Table sections (full width) */}
      {tableSections.length > 0 && (
        <div className="space-y-6">
          {tableSections.map((section, index) => (
            <div 
              key={`table-section-${index}`}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-0">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailCard;