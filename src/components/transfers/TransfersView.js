import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTransfers from '../../hooks/useTransfers';
import TransfersList from './TransfersList';
import TransferDetail from './TransferDetail';
import { ErrorAlert } from '../common';

/**
 * Main component for viewing transfers
 * Handles both list and detail views
 */
const TransfersView = ({ onViewJson }) => {
  const navigate = useNavigate();
  const { transferId } = useParams();
  const [detailMode, setDetailMode] = useState(!!transferId);
  
  const {
    transfers,
    selectedTransfer,
    loading,
    error,
    fetchTransfers,
    fetchTransferById,
    clearSelectedTransfer
  } = useTransfers();
  
  // Fetch transfers on component mount
  useEffect(() => {
    if (!detailMode) {
      fetchTransfers();
    }
  }, [detailMode, fetchTransfers]);
  
  // If a transfer ID is provided in URL, fetch that transfer and show detail view
  useEffect(() => {
    if (transferId) {
      setDetailMode(true);
      fetchTransferById(transferId);
    } else {
      setDetailMode(false);
      clearSelectedTransfer();
    }
  }, [transferId, fetchTransferById, clearSelectedTransfer]);
  
  // Handle back navigation from detail view
  const handleBack = () => {
    navigate('/transfers');
    setDetailMode(false);
    clearSelectedTransfer();
  };
  
  // Handle refresh action
  const handleRefresh = () => {
    if (detailMode && transferId) {
      fetchTransferById(transferId);
    } else {
      fetchTransfers();
    }
  };
  
  // Show detail view when a transfer is selected
  const handleSelectTransfer = (transfer) => {
    navigate(`/transfers/${transfer.transfer_id}`);
  };
  
  // Handle view JSON action
  const handleViewJson = (data, title) => {
    onViewJson && onViewJson(data, title || 'Transfer Data');
  };
  
  // Handle error case
  if (error) {
    return (
      <div className="p-4">
        <ErrorAlert 
          error={error} 
          onRetry={handleRefresh}
        />
      </div>
    );
  }
  
  // Show appropriate view based on mode
  return (
    <div className="p-4">
      {detailMode ? (
        <TransferDetail
          transfer={selectedTransfer}
          loading={loading}
          error={error}
          onBack={handleBack}
          onRefresh={handleRefresh}
          onViewJson={handleViewJson}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The global transfers list is coming soon. For now, you can view transfers for each account in the account detail view.
                </p>
              </div>
            </div>
          </div>
          <TransfersList
            transfers={transfers}
            onSelectTransfer={handleSelectTransfer}
            onViewJson={handleViewJson}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default TransfersView;