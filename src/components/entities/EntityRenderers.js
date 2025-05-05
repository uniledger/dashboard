/**
 * Entity-specific cell renderers
 */
import { getCountryDisplay } from '../../utils/formatters';
import {Link} from 'react-router-dom';

export const entityTypeCellRenderer = (props) => {
    return props.data.type || props.data.entity_type || 'N/A';
}

export const countryCellRenderer = (props) => {
    return getCountryDisplay(props.data);
}

export const kycStatusCellRenderer = (props) => {
    return props.data.kyc_status || 'N/A';
}

export const entityOwnerCellRenderer = (props) => {
    return props.data.r_entity ? props.data.r_entity.name : (props.data.entity ? props.data.entity.name : 'N/A');
}

export const enrichedEntityDrillCellRenderer = (props) => {
    return (
        <Link to={`/entities/${props.data.enriched_entity.entity_id}`}>
            {props.data.enriched_entity.name}
        </Link>
    );
}
