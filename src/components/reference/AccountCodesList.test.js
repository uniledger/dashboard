import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AccountCodesList from './AccountCodesList';
import apiService from '../../services/apiService';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/apiService', () => ({
    reference: {
        getAccountCodes: jest.fn(),
    },
}));

describe('AccountCodesList', () => {
    const mockAccountCodes = [
        {
            site_id: 963,
            account_code: '1100',
            account_code_id: 1100,
            name: 'Current Assets',
            type: 'ASSET',
            description: 'Current Assets',
        },
        {
            site_id: 963,
            account_code: '1101',
            account_code_id: 1101,
            name: 'Cash and Cash Equivalents',
            type: 'ASSET',
            description: 'Cash and Cash Equivalents',
        },
        {
            site_id: 963,
            account_code: '1200',
            account_code_id: 1200,
            name: 'Accounts Receivable',
            type: 'ASSET',
            description: 'Accounts Receivable',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders account codes with site_id, account_code, and account_code_id', async () => {
        apiService.reference.getAccountCodes.mockResolvedValue({
            ok: true,
            data: mockAccountCodes,
        });

        render(
            <MemoryRouter>
                <AccountCodesList />
            </MemoryRouter>
        );

        // Verify column headers
        expect(await screen.findByText('Site ID')).toBeInTheDocument();
        expect(await screen.findByText('Code')).toBeInTheDocument();
        expect(await screen.findByText('Code ID')).toBeInTheDocument();

        // Verify the data rows
        await waitFor(async () => {
            expect(await screen.findByText('963')).toBeInTheDocument();
            expect(await screen.findByText('1100')).toBeInTheDocument();
            expect(await screen.findByText('1101')).toBeInTheDocument();
            expect(await screen.findByText('1200')).toBeInTheDocument();
        });
    });

    it('shows empty message when no account codes are available', async () => {
        apiService.reference.getAccountCodes.mockResolvedValue({
            ok: true,
            data: [],
        });

        render(
            <MemoryRouter>
                <AccountCodesList />
            </MemoryRouter>
        );

        expect(await screen.findByText('No account codes found')).toBeInTheDocument();
    });

    it('displays an error message when fetching account codes fails', async () => {
        apiService.reference.getAccountCodes.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <MemoryRouter>
                <AccountCodesList />
            </MemoryRouter>
        );

        expect(await screen.findByText('Failed to load account codes. Please try again.')).toBeInTheDocument();
    });
});