import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You may need to add this dependency

/**
 * Component for creating and submitting events based on templates
 */
const EventForm = ({ template, ledgers, accounts, onBack, onSubmitEvent, onViewJson }) => {
  // Helper function to get the ledger ID for a transfer
  const getLedgerId = (transfer) => {
    // Try all possible property paths where ledger ID might be found
    return transfer.ledger_id || 
           transfer.ledgerId || 
           transfer.ledger?.ledger_id || 
           transfer.ledger || 
           // Fall back to the event's ledger ID if available
           eventData.ledger_id;
  };

  // Helper function to format IDs properly (especially for uint128 values)
  const formatId = (id) => {
    if (id === undefined || id === null) return 'N/A';
    
    // Check if it's a string already
    if (typeof id === 'string') return id;
    
    // If it's a number in scientific notation (like 8.954231552487467e+37)
    // try to convert it to a full string representation
    try {
      // Convert to string first to handle scientific notation correctly
      const idStr = id.toString();
      
      // Check if it's in scientific notation
      if (idStr.includes('e+')) {
        // Use BigInt for accurate conversion of large integers
        if (typeof BigInt !== 'undefined') {
          // For scientific notation, we need to convert it manually
          const [mantissa, exponent] = idStr.split('e+');
          const mantissaInt = parseFloat(mantissa);
          const exponentInt = parseInt(exponent, 10);
          
          // Create a string with the correct number of digits
          const mantissaStr = mantissaInt.toString().replace('.', '');
          const zerosToAdd = exponentInt - (mantissaStr.length - 1);
          return mantissaStr + '0'.repeat(Math.max(0, zerosToAdd));
        }
      }
      
      // For regular numbers, just use toString
      return idStr;
    } catch (err) {
      console.warn('Error formatting ID:', err);
      return id.toString();
    }
  };
  // Extract accounts that are allowed based on the template constraints
  // For now, we'll just use all accounts since we don't have specific constraints
  
  const [eventData, setEventData] = useState({
    event_id: uuidv4(),
    template_id: template ? template.template_id : '',
    ledger_id: '',
    amount: '',
    accounts: {},
    metadata: {}
  });
  
  const [metadataFields, setMetadataFields] = useState([{ key: '', value: '' }]);
  const [eventResponse, setEventResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update template_id when the template changes
  useEffect(() => {
    if (template) {
      setEventData(prev => ({
        ...prev,
        template_id: template.template_id
      }));
    }
  }, [template]);
  
  // Helper to get required account keys from template
  const getRequiredAccountKeys = () => {
    if (!template) return [];
    
    // Analyze the template legs to find account references
    const accountKeys = new Set();
    
    template.legs.forEach(leg => {
      // Check if the debit_account contains an accounts reference
      const debitMatch = leg.debit_account.match(/accounts\['([^']+)'\]/);
      if (debitMatch) {
        accountKeys.add(debitMatch[1]);
      }
      
      // Check if the credit_account contains an accounts reference
      const creditMatch = leg.credit_account.match(/accounts\['([^']+)'\]/);
      if (creditMatch) {
        accountKeys.add(creditMatch[1]);
      }
    });
    
    return Array.from(accountKeys);
  };
  
  const accountKeys = getRequiredAccountKeys();
  
  const handleAccountChange = (key, accountId) => {
    setEventData(prev => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [key]: parseInt(accountId)
      }
    }));
  };
  
  const handleMetadataKeyChange = (index, key) => {
    const updatedFields = [...metadataFields];
    updatedFields[index].key = key;
    setMetadataFields(updatedFields);
    updateMetadataState(updatedFields);
  };
  
  const handleMetadataValueChange = (index, value) => {
    const updatedFields = [...metadataFields];
    updatedFields[index].value = value;
    setMetadataFields(updatedFields);
    updateMetadataState(updatedFields);
  };
  
  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };
  
  const removeMetadataField = (index) => {
    const updatedFields = metadataFields.filter((_, i) => i !== index);
    setMetadataFields(updatedFields);
    updateMetadataState(updatedFields);
  };
  
  const updateMetadataState = (fields) => {
    const metadata = {};
    fields.forEach(field => {
      if (field.key.trim() !== '' && field.value.trim() !== '') {
        // Try to convert numeric strings to numbers
        const value = !isNaN(field.value) && field.value.trim() !== '' 
          ? parseInt(field.value) 
          : field.value;
        metadata[field.key] = value;
      }
    });
    
    setEventData(prev => ({
      ...prev,
      metadata
    }));
  };
  
  const isFormValid = () => {
    return (
      eventData.event_id.trim() !== '' &&
      eventData.template_id !== '' &&
      eventData.ledger_id !== '' &&
      eventData.amount !== '' &&
      accountKeys.every(key => eventData.accounts[key] !== undefined)
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill out all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await onSubmitEvent(eventData);
      setEventResponse(response);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the event');
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setEventData({
      event_id: uuidv4(),
      template_id: template ? template.template_id : '',
      ledger_id: '',
      amount: '',
      accounts: {},
      metadata: {}
    });
    setMetadataFields([{ key: '', value: '' }]);
    setEventResponse(null);
    setError(null);
  };
  
  if (!template) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="text-center">
          <p className="text-gray-500">Please select a template first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Create Event using Template: {template.name}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{template.description}</p>
        </div>
        
        {/* Show response if we have one */}
        {eventResponse && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-start">
              <h4 className="text-md font-medium text-gray-900">Event Response</h4>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Create Another Event
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Status: {eventResponse.status}</p>
              
              {eventResponse.transfers && eventResponse.transfers.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-900">Generated Transfers:</h5>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eventResponse.transfers.map((transfer, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatId(transfer.id)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatId(getLedgerId(transfer))}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatId(transfer.debit_account_id)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatId(transfer.credit_account_id)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                              <button
                                onClick={() => onViewJson && onViewJson(transfer, `Transfer: ${formatId(transfer.id)}`)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                View JSON
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {eventResponse.errors && eventResponse.errors.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-red-600">Errors:</h5>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {eventResponse.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Show form if we don't have a response yet */}
        {!eventResponse && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            {/* Event ID */}
            <div>
              <label htmlFor="event_id" className="block text-sm font-medium text-gray-700">
                Event ID (UUID)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="event_id"
                  id="event_id"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={eventData.event_id}
                  onChange={(e) => setEventData({ ...eventData, event_id: e.target.value })}
                  required
                />
              </div>
            </div>
            
            {/* Ledger Selection */}
            <div>
              <label htmlFor="ledger_id" className="block text-sm font-medium text-gray-700">
                Ledger
              </label>
              <div className="mt-1">
                <select
                  id="ledger_id"
                  name="ledger_id"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={eventData.ledger_id}
                  onChange={(e) => setEventData({ ...eventData, ledger_id: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Select a ledger</option>
                  {ledgers && ledgers.map((ledger) => (
                    <option key={ledger.ledger_id} value={ledger.ledger_id}>
                      {ledger.name} (ID: {ledger.ledger_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={eventData.amount}
                  onChange={(e) => setEventData({ ...eventData, amount: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            {/* Account Selections */}
            {accountKeys.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Account Selections</h4>
                
                {accountKeys.map((key) => (
                  <div key={key}>
                    <label htmlFor={`account-${key}`} className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Account
                    </label>
                    <div className="mt-1">
                      <select
                        id={`account-${key}`}
                        name={`account-${key}`}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={eventData.accounts[key] || ''}
                        onChange={(e) => handleAccountChange(key, e.target.value)}
                        required
                      >
                        <option value="">Select an account</option>
                        {accounts && accounts.map((account) => (
                          <option key={account.account_extra_id} value={account.account_extra_id}>
                            {account.name} (ID: {account.account_extra_id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Metadata Fields */}
            <div>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">Metadata (Optional)</h4>
                <button
                  type="button"
                  onClick={addMetadataField}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Field
                </button>
              </div>
              
              <div className="mt-2 space-y-3">
                {metadataFields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Key"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={field.key}
                      onChange={(e) => handleMetadataKeyChange(index, e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={field.value}
                      onChange={(e) => handleMetadataValueChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeMetadataField(index)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 ${isLoading || !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Processing...' : 'Submit Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventForm;