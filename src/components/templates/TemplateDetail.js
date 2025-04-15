import React from 'react';

/**
 * Component to display detailed template information
 */
const TemplateDetail = ({ template, onBack, onViewJson, onUseTemplate }) => {
  if (!template) return null;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Template Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {template.name}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={() => onViewJson(template, `Template ${template.template_id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View JSON
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Use This Template
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Template ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.template_id}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.description}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Product Type</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.product}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(template.created_date * 1000).toLocaleString()} by {template.created_by}
            </dd>
          </div>
          
          {/* Variables */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Variables</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {template.variables.map((variable, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variable.name}</td>
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
            </dd>
          </div>
          
          {/* Validations */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Validations</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expression</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {template.validations.map((validation, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{validation.name}</td>
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
            </dd>
          </div>
          
          {/* Template Legs */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Template Legs</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leg #</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Account</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Account</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
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
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TemplateDetail;