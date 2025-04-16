import React from 'react';
import { StandardList } from '../common';
import { getCountryDisplay } from '../../utils/formatters';

/**
 * Entity List component using StandardList for consistent behavior
 */
const EntityList = ({ entities, onViewDetails, onViewJson, onRefresh }) => {
  // Define columns for the DataTable
  const columns = [
    {
      key: 'entity_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Entity Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'type',
      header: 'Type',
      render: (entity) => entity.type || entity.entity_type || 'N/A'
    },
    {
      key: 'country',
      header: 'Country',
      render: (entity) => getCountryDisplay(entity)
    }
  ];

  return (
    <StandardList
      data={entities}
      columns={columns}
      title="Entities"
      idField="entity_id"
      onItemClick={(item) => onViewDetails(item.entity_id)}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search entities..."
      emptyMessage="No entities found"
    />
  );
};

export default EntityList;