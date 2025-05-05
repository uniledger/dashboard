/**
 * Ledger-specific cell renderers
 */
import {Link} from 'react-router-dom';

export const enrichedEntityDrillCellRenderer = (props) => {
    return (
        <Link to={`/entities/${props.data.enriched_entity.entity_id}`}>
            {props.data.enriched_entity.name}
        </Link>
    );
};

export const entityOwnerCellRenderer = (props) => {
    return props.data.r_entity ? props.data.r_entity.name : (props.data.entity ? props.data.entity.name : 'N/A');
};

export const ledgerCurrencyCellRenderer = (props) => {
    return props.data.r_currency ? `${props.data.r_currency.currency_code} (${props.data.r_currency.type})` : 'N/A';
}

export const ledgerNameCellRenderer = (props) => {
    return props.data.enriched_ledger?.name || 
    props.data.ledger?.name || 
    props.data.ledger_name || 
    'N/A';
}

export const ledgerDrillCellRenderer = (props) => {
    if (!props.data.ledger) return 'N/A';
    return <Link to={`/ledgers/${props.data.ledger}`}>{props.data.ledger}</Link>;
}

export const ledgerIDDrillCellRenderer = (props) => {
    if (!props.data.ledger_id) return 'N/A';
    return <Link to={`/ledgers/${props.data.ledger_id}`}>{props.data.ledger_id}</Link>;
}

export const enrichedLedgerDrillCellRenderer = (props) => {
    const enrichedLedger = props.data.enriched_ledger;
    const id = enrichedLedger?.ledger_id;
    const name = enrichedLedger?.name;
    return id ? (
        <Link to={`/ledgers/${id}`}>{name ? `${name} (${id})` : id}</Link>
    ) : 'N/A';
}
