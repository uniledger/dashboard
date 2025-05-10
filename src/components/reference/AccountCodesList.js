import React, { useState, useEffect } from 'react';
import { GenericListView } from '../common';
import apiService from '../../services/apiService';

/**
 * Account Codes List component using GenericListView
 */
const AccountCodesList = ({ onViewJson, onRefresh }) => {
    const [accountCodes, setAccountCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define columns for the DataTable
    const columns = [
        {
            field: 'site_id',
            headerName: 'Site ID',
            cellClassName: 'font-medium text-gray-900',
            render: (code) => (code.site_id !== undefined && code.site_id !== null ? String(code.site_id) : 'N/A'),
        },
        {
            field: 'account_code',
            headerName: 'Code',
            cellClassName: 'font-medium text-gray-900',
            render: (code) => (code.account_code !== undefined && code.account_code !== null ? String(code.account_code) : 'N/A'),
        },
        {
            field: 'account_code_id',
            headerName: 'Code ID',
            cellClassName: 'font-medium text-gray-900',
            render: (code) => (code.account_code_id !== undefined && code.account_code_id !== null ? String(code.account_code_id) : 'N/A'),
        },
        {
            field: 'name',
            headerName: 'Name',
            cellClassName: 'text-gray-500',
            render: (code) => code.name || 'N/A',
        },
        {
            field: 'type',
            headerName: 'Type',
            cellClassName: 'text-gray-500',
            render: (code) => code.type || 'N/A',
        },
        {
            field: 'description',
            headerName: 'Description',
            cellClassName: 'text-gray-500',
            render: (code) => code.description || 'N/A',
        },
    ];

    // Unified fetch function for initial load and refresh
    const fetchAccountCodes = async () => {
        setLoading(true);
        try {
            const response = await apiService.reference.getAccountCodes();

            if (response.ok && response.data) {
                setAccountCodes(response.data);
                setError(null);
            } else {
                console.error('Failed to load account codes:', response.error);
                setError('Failed to load account codes. Please try again.');
                setAccountCodes([]);
            }
        } catch (err) {
            console.error('Error loading account codes:', err);
            setError('Failed to load account codes. Please try again.');
            setAccountCodes([]);
        } finally {
            setLoading(false);
        }
        return Promise.resolve(); // Ensure we return a promise for GenericListView
    };

    useEffect(() => {
        fetchAccountCodes();
    }, []);

    return (
        <GenericListView
            data={accountCodes}
            columns={columns}
            title="Account Codes"
            idField="account_code"
            loading={loading}
            error={error}
            onViewJson={onViewJson}
            onRefresh={fetchAccountCodes}
            searchPlaceholder="Search account codes..."
            emptyMessage="No account codes found"
        />
    );
};

export default AccountCodesList;