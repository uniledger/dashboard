import React from 'react';

/**
 * Reusable detail card component for showing entity, ledger, account, etc. details
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {Array} props.sections - Array of section objects with label and content
 * @param {React.ReactNode} props.actions - Optional action buttons to display
 * @returns {JSX.Element} - Rendered component
 */
const DetailCard = ({ title, subtitle, sections, actions }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-3">{actions}</div>
        )}
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <dt className="text-sm font-medium text-gray-500">
                {section.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {section.content}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default DetailCard;