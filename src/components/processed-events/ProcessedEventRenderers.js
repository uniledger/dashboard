/**
 * ProcessedEvent-specific cell renderers
 */
import {Link} from 'react-router-dom';

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
