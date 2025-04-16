import React from 'react';

/**
 * Reusable detail card component for showing entity, ledger, account, etc. details
 * with a modern card-type layout
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {Array} props.sections - Array of section objects with label and content
 * @param {React.ReactNode} props.actions - Optional action buttons to display
 * @returns {JSX.Element} - Rendered component
 */
const DetailCard = ({ title, subtitle, sections, actions }) => {
  // Split sections into basic fields and table/complex sections
  const basicSections = [];
  const tableSections = [];
  
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
    
    if (hasTableContent) {
      tableSections.push(section);
    } else {
      basicSections.push(section);
    }
  });
  
  return (
    <div>
      {/* Header section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex space-x-3">{actions}</div>
          )}
        </div>
      </div>
      
      {/* Basic fields in card grid */}
      {basicSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {basicSections.map((section, index) => (
            <div 
              key={`basic-section-${index}`}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-2">
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                  {section.label}
                </h3>
              </div>
              <div className="text-gray-900">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Table sections (full width) */}
      {tableSections.length > 0 && (
        <div className="space-y-6">
          {tableSections.map((section, index) => (
            <div 
              key={`table-section-${index}`}
              className="bg-white shadow-sm rounded-lg p-6"
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                  {section.label}
                </h3>
              </div>
              <div>
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