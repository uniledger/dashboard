/**
 * Entity model configuration
 */
import { getCountryDisplay } from '../../utils/formatters';

export const EntityConfig = {
  title: 'Entity',
  idField: 'entity_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'entity_id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'entity_type',
      headerName: 'Type',
    },
    {
      field: 'country',
      headerName: 'Country',
      cellRenderer: props => getCountryDisplay(props.data),
    },
    {
      field: 'kyc_status',
      headerName: 'KYC Status',
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (entity) => [
    {
      label: 'Entity ID',
      content: entity.entity_id
    },
    {
      label: 'Name',
      content: entity.name
    },
    {
      label: 'Type',
      content: entity.type || entity.entity_type || 'N/A'
    },
    {
      label: 'Country',
      content: getCountryDisplay(entity)
    },
    {
      label: 'KYC Status',
      content: entity.kyc_status || 'N/A'
    }
  ]
};
