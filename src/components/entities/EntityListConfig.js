/**
 * Entity model configuration
 */
import { getCountryDisplay } from '../../utils/formatters';

export const EntityListConfig = {
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
  
};
