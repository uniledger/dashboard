import React from 'react';

/**
 * Reusable detail card component for showing entity, ledger, account, etc. details
 * Compact grid layout similar to the original ledger detail view
 * @param {Object} props - Component props
 * @param {string} props.title - Card title (only shown if subtitle not provided)
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
      {/* Header section - only show actions, not the title (that's in page header) */}
      <div className="flex justify-end mb-4">
        {actions && (
          <div className="flex space-x-3">{actions}</div>
        )}
      </div>
      
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
                <div className="text-sm text-gray-900">
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
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  {section.label}
                </h3>
              </div>
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