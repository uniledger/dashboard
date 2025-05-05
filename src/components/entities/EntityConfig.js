/**
 * Entity model configuration
 */
import { getCountryDisplay } from '../../utils/formatters';
import { entityTypeCellRenderer, countryCellRenderer, kycStatusCellRenderer } from './EntityRenderers.js';

export const EntityConfig = {
  title: 'Entity',
  idField: 'entity_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'entity_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'type',
      headerName: 'Type',
      cellRenderer: entityTypeCellRenderer
    },
    {
      field: 'country',
      headerName: 'Country',
      cellRenderer: countryCellRenderer
    },
    {
      field: 'kyc_status',
      headerName: 'KYC Status',
      cellRenderer: kycStatusCellRenderer
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
