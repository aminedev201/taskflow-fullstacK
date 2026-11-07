import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function FilterSelect({ label, value, onChange, options, sx }) {
  const { t } = useTranslation();
  return (
    <TextField
      select
      size="small"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      sx={{ minWidth: 150, ...sx }}
    >
      <MenuItem value="">{t('common.all')}</MenuItem>
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
      ))}
    </TextField>
  );
}
