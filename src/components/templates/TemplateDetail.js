import React from 'react';
import { DetailCard, ActionButton } from '../common';

/**
 * Component to display detailed template information
 * using the standard DetailCard component for consistency
 */
const TemplateDetail = ({ template, onBack, onViewJson, onUseTemplate }) => {
  if (!template) return null;

  // Helper function to format field names by removing underscores and capitalizing each word
  const formatFieldName = (fieldName) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Define actions for the detail card
  const detailActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(template, `Template ${template.template_id}`)}
      >
        View JSON
      </ActionButton>
      <ActionButton
        variant="primary"
        onClick={() => onUseTemplate(template)}
      >
        Use This Template
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onBack}
      >
        Back
      </ActionButton>
    </>
  );

  // Define sections for the detail card
  const basicSections = [
    {
      label: formatFieldName('template_id'),
      content: template.template_id
    },
    {
      label: formatFieldName('name'),
      content: template.name
    },
    {
      label: formatFieldName('description'),
      content: template.description
    },
    {
      label: formatFieldName('product_type'),
      content: template.product
    },
    {
      label: formatFieldName('created'),
      content: `${new Date(template.created_date * 1000).toLocaleString()} by ${template.created_by}`
    },
    {
      label: formatFieldName('variables'),
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('name')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('value')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.variables.map((variable, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatFieldName(variable.name)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variable.value}</td>
                </tr>
              ))}
              {template.variables.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No variables defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    },
    {
      label: formatFieldName('validations'),
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('name')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('expression')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('description')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.validations.map((validation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatFieldName(validation.name)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{validation.expression}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{validation.description}</td>
                </tr>
              ))}
              {template.validations.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No validations defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    },
    {
      label: formatFieldName('template_legs'),
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('leg_number')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('debit_account')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('credit_account')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('code')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatFieldName('amount')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.legs.map((leg, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leg.leg_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.debit_account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.credit_account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.amount}</td>
                </tr>
              ))}
              {template.legs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No legs defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }
  ];

  return (
    <DetailCard
      title="Template Detail"
      subtitle={template.name}
      sections={basicSections}
      actions={detailActions}
    />
  );
};

export default TemplateDetail;