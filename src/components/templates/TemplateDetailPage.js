import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TemplateDetail from './TemplateDetail';
import apiService from '../../services/apiService';
import { LoadingSpinner, ErrorAlert } from '../common';

/**
 * Page component for router-based template detail view.
 * Fetches the list of templates and finds the one matching the :templateId param.
 */
const TemplateDetailPage = ({ onViewJson }) => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await apiService.transaction.getTemplates();
        if (resp.ok && Array.isArray(resp.data)) {
          const found = resp.data.find(t => String(t.template_id) === String(templateId));
          if (found) {
            setTemplate(found);
          } else {
            throw new Error(`Template not found: ${templateId}`);
          }
        } else {
          throw new Error(resp.error?.message || 'Failed to load templates');
        }
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading template..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={() => navigate('/templates')} />
      </div>
    );
  }

  return (
    <TemplateDetail
      template={template}
      onBack={() => navigate('/templates')}
      onViewJson={onViewJson}
    />
  );
};

export default TemplateDetailPage;