import React from 'react';
import { GenericListView } from '../common';
import { ledgerDrillCellRenderer } from '../ledgers/LedgerRenderers.js';
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { formatBalance, formatDate } from '../../utils/formatters/index';

/**
 * Renders a list of transfers for a specific account using the `GenericListView` component.
 * It displays details such as transfer ID, related account, amount, timestamp, and ledger.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.transfers - An array of transfer objects to display.
 * @param {string|number} props.accountId - The ID of the account whose transfers are being displayed. Used to determine the 'related account'.
 * @param {function} [props.onViewJson] - Callback function to display raw JSON data for a transfer.
 * @param {function} [props.onRefresh] - Callback function to refresh the list of transfers.
 * @param {boolean} [props.loading=false] - Indicates if the transfer data is currently being loaded.
 * @returns {JSX.Element} The rendered AccountTransfersList component.
 */
const AccountTransfersList = ({ transfers, accountId, onViewJson, onRefresh, loading = false }) => {

  const accountContext  = { accountId };
  accountContext.accountId = accountId;

  
  const columns = [

    {
      field: 'id',
      headerName: 'ID',
    },

    {
      field: 'related_account',
      headerName: 'Related Account',
      cellRenderer: props => {
        const currentAccountId = parseInt(props.context.accountId, 10);

        let relatedAccountId;
        

        if (currentAccountId === props.data.debit_account_id) {
            relatedAccountId = props.data.credit_account_id;
        } 

        else if (currentAccountId === props.data.credit_account_id) {
            relatedAccountId = props.data.debit_account_id;
        }
    

    return drillFormatter('accounts', relatedAccountId, relatedAccountId);
      }
    },

    {
      field: 'amount',
      headerName: 'Amount',
      type: 'rightAligned',
      cellRenderer: props => formatBalance(props.value, false),
    },

    {
      field: 'timestamp',
      headerName: 'Timestamp',
      cellRenderer: props => formatDate(props.value, true),  
      width: 180
    },

    {
      field: 'ledger',
      headerName: 'Ledger',
      cellRenderer: ledgerDrillCellRenderer,
    }
  ];



  const gridHeight = Math.max(300, Math.min(transfers.length * 48, 600));

  return (
    <div className="bg-white rounded-lg shadow">
      <GenericListView
        title="Account Transfers"
        data={transfers || []}
        columns={columns}
        context={accountContext}
        idField="id"
        emptyMessage="No transfers found for this account"
        gridHeight={gridHeight}
        onViewJson={onViewJson}
        onRefresh={onRefresh}
        loading={loading}
      />
    </div>
  );
};

export default AccountTransfersList;