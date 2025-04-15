import React, { useState } from 'react';

/**
 * Component to display a list of templates
 */
const TemplatesList = ({ templates, onSelectTemplate, onViewJson, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Templates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse available transaction templates
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredTemplates.map((template) => (
          <li key={template.template_id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {template.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ID: {template.template_id} | Type: {template.product}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 space-x-2">
                    <button
                      onClick={() => onViewJson(template, `Template ${template.template_id}`)}
                      className="px-3 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                    >
                      View JSON
                    </button>
                    <button
                      onClick={() => onSelectTemplate(template)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {template.description.length > 150 
                        ? `${template.description.substring(0, 150)}...` 
                        : template.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created: {new Date(template.created_date * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Show tags for template legs */}
                <div className="mt-2 flex flex-wrap">
                  {template.legs.map((leg, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-1"
                    >
                      Leg #{leg.leg_number}: {leg.code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
        {filteredTemplates.length === 0 && (
          <li>
            <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No templates found.
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TemplatesList;