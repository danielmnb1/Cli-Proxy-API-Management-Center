import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { AuthFileModelItem } from '@/features/authFiles/constants';
import { isModelExcluded } from '@/features/authFiles/constants';
import styles from '@/pages/AuthFilesPage.module.scss';

export type AuthFileModelsModalProps = {
  open: boolean;
  fileName: string;
  fileType: string;
  loading: boolean;
  error: 'unsupported' | null;
  models: AuthFileModelItem[];
  excluded: Record<string, string[]>;
  onClose: () => void;
  onCopyText: (text: string) => void;
};

export function AuthFileModelsModal(props: AuthFileModelsModalProps) {
  const { t } = useTranslation();
  const { open, fileName, fileType, loading, error, models, excluded, onClose, onCopyText } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('auth_files.models_title', { defaultValue: 'Modelos compatibles' }) + ` - ${fileName}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          {t('common.close')}
        </Button>
      }
    >
      {loading ? (
        <div className={styles.hint}>
          {t('auth_files.models_loading', { defaultValue: 'Cargando lista de modelos...' })}
        </div>
      ) : error === 'unsupported' ? (
        <EmptyState
          title={t('auth_files.models_unsupported', { defaultValue: 'Esta función no es compatible con la versión actual' })}
          description={t('auth_files.models_update_hint', {
            defaultValue: 'Actualice CLI Proxy API a la última versión y vuelva a intentarlo'
          })}
        />
      ) : models.length === 0 ? (
        <EmptyState
          title={t('auth_files.models_empty', { defaultValue: 'No hay modelos disponibles para esta credencial' })}
          description={t('auth_files.models_not_loaded_hint', {
            defaultValue: 'Es posible que el servidor aún no haya cargado esta credencial de autenticación o que no tenga ningún modelo vinculado'
          })}
        />
      ) : (
        <div className={styles.modelsList}>
          {models.map((model) => {
            const excludedModel = isModelExcluded(model.id, fileType, excluded);
            return (
              <div
                key={model.id}
                className={`${styles.modelItem} ${excludedModel ? styles.modelItemExcluded : ''}`}
                onClick={() => {
                  onCopyText(model.id);
                }}
                title={
                  excludedModel
                    ? t('auth_files.models_excluded_hint', {
                      defaultValue: 'Este modelo OAuth ha sido desactivado'
                    })
                    : t('common.copy', { defaultValue: 'Haga clic para copiar' })
                }
              >
                <span className={styles.modelId}>{model.id}</span>
                {model.display_name && model.display_name !== model.id && (
                  <span className={styles.modelDisplayName}>{model.display_name}</span>
                )}
                {model.type && <span className={styles.modelType}>{model.type}</span>}
                {excludedModel && (
                  <span className={styles.modelExcludedBadge}>
                    {t('auth_files.models_excluded_badge', { defaultValue: 'Desactivado' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

