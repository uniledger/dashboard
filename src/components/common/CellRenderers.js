
import { formatBalance, formatDate, formatAccountCode, getCountryDisplay, getAccountType, getBalanceClass, getCurrencyInfo } from '../../utils/formatters/index';
import {Link} from 'react-router-dom'
    
export const accountIDCellRenderer =  props => {
    return props.data.account_id || props.data.account_extra_id || 'N/A';
}

export const accountIDDrillCellRenderer = props => {
    const acc = props.data;                                                                        
    if (!acc) return 'N/A';                                                                                
    const accId = acc.account_id || acc.account_extra_id;                                                  
    const accName = acc.name; 
    return accId ? (
        <Link to={`/accounts/${accId}`}>{accId}</Link>
    ) : 'N/A';
}

export const fromAccountDrillCellRenderer = props => {
    const acc = props.data.accounts?.from;                                                                        
    if (!acc) return 'N/A';                                                                                
    const accId = acc.account_id || acc.account_extra_id;                                                  
    const accName = acc.name; 
    return accId ? (
        <Link to={`/accounts/${accId}`}>{accName ? `${accName} (${accId})` : accId}</Link>
    ) : 'N/A';
}

export const genericIDCellRenderer = props => {
    return props.data.id ? props.data.id.toString() : 'N/A'
}

export const accountCodeCellRenderer = props => {
    return formatAccountCode(props.data.account_code || props.data.code);
}

export const accountTypeCellRenderer = props => {
    return getAccountType(props.data)
}

export const accountCurrencyCellRenderer = props => {
    //TODO: refactor this out
    const getCurrencyCode = (account) => {
        return (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
          account.currency_code || 
          'N/A';
      };
    return getCurrencyCode(props.data)
}

export const ledgerCurrencyCellRenderer = props => {
    return props.data.r_currency ? `${props.data.r_currency.currency_code} (${props.data.r_currency.type})` : 'N/A'
}

export const accountOwnerCellRenderer = props => {
    const owner = props.data.r_entity || props.data.enriched_ledger?.r_entity;
    return owner?.name || '';
}

export const balanceCellRenderer = props => {
    const currency = getCurrencyInfo(props.data);
    return formatBalance(props.data.balance, currency, true /*, currency.symbol*/);
}

export const transferBalanceCellRenderer = props => {
    // If this account is the debit account, show negative amount
    const isDebit = props.data.debit_account_id === parseInt(props.context.accountId, 10);
    const amount = isDebit ? -Math.abs(props.data.amount) : Math.abs(props.data.amount);
    
    // Get currency from the item, default to generic formatting if not available
    return formatBalance(amount, {});
}

export const enrichedEntityDrillCellRenderer = props => {
    return <Link to={`/entities/${props.data.enriched_entity.entity_id}`}>
                {props.data.enriched_entity.name}
            </Link>;
}

export const amountCellRenderer = props => {
    return formatBalance(props.data.amount, {});
}

export const ledgerNameCellRenderer = props => {
    return props.data.enriched_ledger?.name || 
    props.data.ledger?.name || 
    props.data.ledger_name || 
    'N/A';
}

export const entityTypeCellRenderer = props => {
    return props.data.type || props.data.entity_type || 'N/A'
}

export const countryCellRenderer = props => {
    return getCountryDisplay(props.data)
}
export const kycStatusCellRenderer = props => {
    return props.data.kyc_status || 'N/A'
}

export const entityOwnerCellRenderer = props => {
    return props.data.r_entity ? props.data.r_entity.name : (props.data.entity ? props.data.entity.name : 'N/A');
}

export const relatedAccountDrillCellRenderer = props => {
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

// Why two different?
export const timestampDateCellRenderer = props => {
    if (!props.data.timestamp) return 'N/A';
    // Convert nanoseconds to milliseconds (divide by 1,000,000)
    // Then convert to seconds for formatDate (divide by 1000)
    const seconds = Math.floor(props.data.timestamp / 1000000) / 1000;
    return formatDate(seconds, true);
}

export const eventTimestampDateCellRenderer = props => {
    return props.data.timestamp ? new Date(props.data.timestamp * 1000).toLocaleString() : 'N/A';
}

// consolidate these
export const ledgerDrillCellRenderer = props => {
    if (!props.data.ledger) return 'N/A';
    return <Link to={`/ledgers/${props.data.ledger}`}>{props.data.ledger}</Link>;
}

export const ledgerIDDrillCellRenderer = props => {
    if (!props.data.ledger_id) return 'N/A';
    return <Link to={`/ledgers/${props.data.ledger_id}`}>{props.data.ledger_id}</Link>;
}

// TODO: Consolidate
export const eventsFromLedgerDrillCellRenderer = props => {
    // Some APIs may use nested object or direct field
    const enrichedLedger = props.data.accounts?.from?.enriched_ledger;
    const id = enrichedLedger?.ledger_id;
    const name = enrichedLedger?.name;
    return id ? (
        <Link to={`/ledgers/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
}

export const enrichedLedgerDrillCellRenderer = props => {
    // Some APIs may use nested object or direct field
    const enrichedLedger = props.data.enriched_ledger;
    const id = enrichedLedger?.ledger_id;
    const name = enrichedLedger?.name;
    return id ? (
        <Link to={`/ledgers/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
}

export const processedEventDrillCellRenderer = props => {
     return props.data.event_id ? (
            <Link to={`/processed-events/${props.data.event_id}`}>{props.data.event_id}</Link>
          ) : 'N/A'
}

export const eventTemplateDrillCellRenderer = props => {
    const id = props.data.template?.template_id || props.data.template_id;
    const name = props.data.template?.name;
    return id ? (
        <Link to={`/templates/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
}