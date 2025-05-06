export const EventEntryPageConfig = {
  templateSelectionColumns: [
    {
      field: 'template_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      field: 'name',
      headerName: 'Template Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'product',
      headerName: 'Type',
      cellClassName: 'text-gray-500',
    },
    {
      field: 'description',
      headerName: 'Description',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return item.description.length > 100 
          ? `${item.description.substring(0, 100)}...` 
          : item.description;
      }
    },
    {
      field: 'created_date',
      headerName: 'Created',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return new Date(item.created_date * 1000).toLocaleDateString();
      }
    }
  ]
};
