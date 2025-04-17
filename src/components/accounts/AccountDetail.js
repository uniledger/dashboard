import React from 'react';
import { GenericDetailView, AccountConfig } from '../common';

/**
 * Account Detail component using GenericDetailView
 */
const AccountDetail = ({ 
  account, 
  onViewJson, 
  onBack, 
  onRefresh, 
  onViewEntity, 
  onViewLedger 
}) => {
  // Extract entity and ledger information
  const entity = account?.entity || account?.enriched_entity || 
    (account?.enriched_ledger && account?.enriched_ledger.entity);
    
  const ledger = account?.ledger || account?.enriched_ledger;
  
  // Create entity and ledger link sections if available
  const entitySection = entity ? {
    label: 'Entity',
    content: (
      <button 
        className="text-blue-600 hover:text-blue-800 hover:underline"
        onClick={() => entity.entity_id && onViewEntity && onViewEntity(entity.entity_id)}
      >
        {entity.name || entity.entity_id}
      </button>
    )
  } : null;
  
  const ledgerSection = ledger ? {
    label: 'Ledger',
    content: (
      <button 
        className="text-blue-600 hover:text-blue-800 hover:underline"
        onClick={() => ledger.ledger_id && onViewLedger && onViewLedger(ledger.ledger_id)}
      >
        {ledger.name || ledger.ledger_id}
      </button>
    )
  } : null;

  // Get standard sections from model config
  let sections = account ? [...AccountConfig.detailSections(account, entity, ledger)] : [];
  
  // Add creation info if available
  if (account?.date_created) {
    sections.push({
      label: 'Created',
      content: new Date(account.date_created).toLocaleString()
    });
  }
  
  // Add entity and ledger link sections if available
  if (entitySection) {
    // Insert entity section after account type (index 3)
    sections.splice(3, 0, entitySection);
  }
  
  if (ledgerSection) {
    // Insert ledger section after entity section or after account type
    const insertIndex = entitySection ? 4 : 3;
    sections.splice(insertIndex, 0, ledgerSection);
  }
  
  // Use GenericDetailView for consistent presentation
  return (
    <GenericDetailView
      data={account}
      title={AccountConfig.title + " Detail"}
      subtitle={account?.name}
      sections={sections}
      onBack={onBack}
      onRefresh={onRefresh}
      onViewJson={onViewJson}
      loadingMessage="Loading account details..."
    />
  );
};

export default AccountDetail;