import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import AccountList from './AccountList';
import * as useAccountsModule from '../../hooks/useAccounts';
import { MemoryRouter } from 'react-router-dom';



describe('AccountList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    jest.spyOn(useAccountsModule, 'default').mockReturnValue({
      accounts: [],
      loading: true,
      fetchAccounts: jest.fn(),
    });
    render(<AccountList />, { wrapper: MemoryRouter });
    // You may need to adjust this selector depending on your spinner implementation
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders account rows', () => {
    jest.spyOn(useAccountsModule, 'default').mockReturnValue({
      accounts: [
        { account_id: '1', name: 'Test Account 1' },
        { account_id: '2', name: 'Test Account 2' }
      ],
      loading: false,
      fetchAccounts: jest.fn(),
    });
    render(<AccountList />, { wrapper: MemoryRouter });
    expect(screen.getByText('Test Account 1')).toBeInTheDocument();
    expect(screen.getByText('Test Account 2')).toBeInTheDocument();
  });

  it('shows empty message', () => {
    jest.spyOn(useAccountsModule, 'default').mockReturnValue({
      accounts: [],
      loading: false,
      fetchAccounts: jest.fn(),
    });
    render(<AccountList />, { wrapper: MemoryRouter });
    expect(screen.getByText('No accounts found')).toBeInTheDocument();
  });

  // NOTE: AG Grid event system does not reliably fire onRowClick handlers in JSDOM/RTL tests.
  // Instead, we directly test the exported handleViewAccount logic to ensure navigation works.
  it('navigates to account detail when handleViewAccount is called', () => {
    AccountList.handleViewAccount({ account_id: '1' });
    expect(mockNavigate).toHaveBeenCalledWith('/accounts/1');
  });

  it('calls fetchAccounts on refresh', () => {
    const fetchAccounts = jest.fn();
    jest.spyOn(useAccountsModule, 'default').mockReturnValue({
      accounts: [{ account_id: '1', name: 'Test Account 1' }],
      loading: false,
      fetchAccounts,
    });
    render(<AccountList />, { wrapper: MemoryRouter });
    // Simulate clicking the refresh button if present
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    expect(fetchAccounts).toHaveBeenCalled();
  });
});
