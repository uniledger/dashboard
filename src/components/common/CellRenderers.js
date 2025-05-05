
import { formatBalance, formatDate, getCountryDisplay } from '../../utils/formatters/index';
import {Link} from 'react-router-dom';

/**
 * Generic cell renderers used across multiple components
 */

export const jsonCellRenderer = (props) => {
    return (
        <div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    props.context.jsonRowHandler(props.data);
                }}
                title="View JSON"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 16h8" />
                    <path d="M8 12h8" />
                </svg>
            </button>
        </div>
    );
};

export const genericIDCellRenderer = (props) => {
    return props.data.id ? props.data.id.toString() : 'N/A';
};

export const amountCellRenderer = (props) => {
    return formatBalance(props.data.amount, {});
};

export const timestampDateCellRenderer = (props) => {
    if (!props.data.timestamp) return 'N/A';
    // Convert nanoseconds to milliseconds (divide by 1,000,000)
    // Then convert to seconds for formatDate (divide by 1000)
    const seconds = Math.floor(props.data.timestamp / 1000000) / 1000;
    return formatDate(seconds, true);
};

export const eventTimestampDateCellRenderer = (props) => {
    return props.data.timestamp ? new Date(props.data.timestamp * 1000).toLocaleString() : 'N/A';
};

export const countryCellRenderer = (props) => {
    return getCountryDisplay(props.data);
};

export const fromAccountDrillCellRenderer = (props) => {
    const acc = props.data.accounts?.from;
    if (!acc) return 'N/A';
    const accId = acc.account_id || acc.account_extra_id;
    const accName = acc.name;
    return accId ? (
        <Link to={`/accounts/${accId}`}>{accName ? `${accName} (${accId})` : accId}</Link>
    ) : 'N/A';
};

export const eventsFromLedgerDrillCellRenderer = (props) => {
    const enrichedLedger = props.data.accounts?.from?.enriched_ledger;
    const id = enrichedLedger?.ledger_id;
    const name = enrichedLedger?.name;
    return id ? (
        <Link to={`/ledgers/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
};

export const processedEventDrillCellRenderer = (props) => {
    return props.data.event_id ? (
        <Link to={`/processed-events/${props.data.event_id}`}>{props.data.event_id}</Link>
    ) : 'N/A';
};

export const eventTemplateDrillCellRenderer = (props) => {
    const id = props.data.template?.template_id || props.data.template_id;
    const name = props.data.template?.name;
    return id ? (
        <Link to={`/templates/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
};

export const entityOwnerCellRenderer = (props) => {
    return props.data.r_entity ? props.data.r_entity.name : (props.data.entity ? props.data.entity.name : 'N/A');
};
