/**
 * Account-specific cell renderers
 */
import { formatBalance, formatAccountCode, getAccountType, getCurrencyInfo } from '../../utils/formatters/index';
import {Link} from 'react-router-dom';

export const transferBalanceCellRenderer = (props) => {
    // If this account is the debit account, show negative amount
    const isDebit = props.data.debit_account_id === parseInt(props.context.accountId, 10);
    const amount = isDebit ? -Math.abs(props.data.amount) : Math.abs(props.data.amount);
    
    // Get currency from the item, default to generic formatting if not available
    return formatBalance(amount, {});
};

export const accountIDCellRenderer = (props) => {
    return props.data.account_id || props.data.account_extra_id || 'N/A';
}

export const accountIDDrillCellRenderer = (props) => {
    const acc = props.data;                                                                        
    if (!acc) return 'N/A';                                                                                
    const accId = acc.account_id || acc.account_extra_id;                                                 
    const accName = acc.name; 
    return accId ? (
        <Link to={`/accounts/${accId}`}>{accId}</Link>
    ) : 'N/A';
}

export const accountCodeCellRenderer = (props) => {
    return formatAccountCode(props.data.account_code || props.data.code);
}

export const accountTypeCellRenderer = (props) => {
    return getAccountType(props.data);
}

export const accountCurrencyCellRenderer = (props) => {
    const getCurrencyCode = (account) => {
        return (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
          account.currency_code || 
          'N/A';
    };
    return getCurrencyCode(props.data);
}

export const accountOwnerCellRenderer = (props) => {
    const owner = props.data.r_entity || props.data.enriched_ledger?.r_entity;
    return owner?.name || '';
}

export const balanceCellRenderer = (props) => {
    const currency = getCurrencyInfo(props.data);
    return formatBalance(props.data.balance, currency, true);
}

export const relatedAccountDrillCellRenderer = (props) => {
    // Parse the accountId as number to ensure comparison works (it might be a string from URL params)
    const currentAccountId = parseInt(props.context?.accountId, 10);

    // Determine which account ID is the related one
    let relatedAccountId;
    
    // If this account is the debit account, show the credit account as related
    if (currentAccountId === props.data.debit_account_id) {
        relatedAccountId = props.data.credit_account_id;
    } 
    // If this account is the credit account, show the debit account as related
    else if (currentAccountId === props.data.credit_account_id) {
        relatedAccountId = props.data.debit_account_id;
    }
    
    return relatedAccountId ? (
        <Link to={`/accounts/${relatedAccountId}`}>
          {relatedAccountId} {/* Or a formatted name */}
        </Link>
      ) : (
        'N/A' // Return plain string/null for non-links
      );
}
