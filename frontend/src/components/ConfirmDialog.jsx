import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConfirmDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('common.delete')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('common.confirmDelete')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>{t('common.delete')}</Button>
      </DialogActions>
    </Dialog>
  );
}
