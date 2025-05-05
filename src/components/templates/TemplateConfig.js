/**
 * Template model configuration
 */
import React from 'react';
import { formatDate } from '../../utils/formatters/dateFormatters';

export const TemplateConfig = {
  title: 'Template',
  idField: 'template_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'template_id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Template Name',
    },
    {
      field: 'product',
      headerName: 'Type',
    },
    {
      field: 'description',
      headerName: 'Description',
    },
    {
      field: 'created_date',
      headerName: 'Created',
      cellRenderer: (params) => formatDate(params.value, true)
    }
  ],
  
  // Format field names by removing underscores and capitalizing each word
  formatFieldName: (fieldName) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // Variables columns definition
  variablesColumns: [
    {
      field: 'name',
      headerName: 'Name',
      cellRenderer: (params) => TemplateConfig.formatFieldName(params.data.name),
    },
    {
      field: 'value',
      headerName: 'Value',
    },
    {
      field: 'expression',
      headerName: 'Expression',
    }
  ],
  
  // Helper to render variable section
  renderVariablesSection: (template) => {
    return template.variables && template.variables.length > 0 ? (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Variables</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TemplateConfig.variablesColumns.map((col) => (
                  <th key={col.field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.variables.map((variable) => (
                <tr key={variable.name}>
                  {TemplateConfig.variablesColumns.map((col) => (
                    <td key={col.field} className="px-6 py-4 whitespace-nowrap">
                      {col.cellRenderer ? col.cellRenderer({ data: variable }) : variable[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;
  },
  
  // Validations columns definition
  validationsColumns: [
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'expression',
      headerName: 'Expression',
    }
  ],
  
  // Helper to render validations section
  renderValidationsSection: (template) => {
    return template.validations && template.validations.length > 0 ? (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Validations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TemplateConfig.validationsColumns.map((col) => (
                  <th key={col.field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.validations.map((validation) => (
                <tr key={validation.name}>
                  {TemplateConfig.validationsColumns.map((col) => (
                    <td key={col.field} className="px-6 py-4 whitespace-nowrap">
                      {validation[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;
  },
  
  // Legs columns definition
  legsColumns: [
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'description',
      headerName: 'Description',
    }
  ],
  
  // Helper to render legs section
  renderLegsSection: (template) => {
    return template.legs && template.legs.length > 0 ? (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Legs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TemplateConfig.legsColumns.map((col) => (
                  <th key={col.field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.legs.map((leg) => (
                <tr key={leg.name}>
                  {TemplateConfig.legsColumns.map((col) => (
                    <td key={col.field} className="px-6 py-4 whitespace-nowrap">
                      {leg[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;
  },
  
  // Basic section fields for detail view
  detailSections: (template) => {
    if (!template) return [];
    return [
      {
        label: 'Template ID',
        content: template.template_id || 'N/A'
      },
      {
        label: 'Name',
        content: template.name || 'N/A'
      },
      {
        label: 'Type',
        content: template.product || 'N/A'
      },
      {
        label: 'Description',
        content: template.description || 'No description'
      },
      {
        label: 'Created',
        content: template.created_date ? formatDate(template.created_date, true) : 'N/A'
      }
    ];
  }
};
