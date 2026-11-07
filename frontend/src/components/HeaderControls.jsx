import { useContext, useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTranslation } from 'react-i18next';
import ColorModeContext from '../providers/ColorModeContext';
import { LANGUAGES } from '../i18n';

export default function HeaderControls() {
  const { t, i18n } = useTranslation();
  const { mode, toggle } = useContext(ColorModeContext);
  const [anchor, setAnchor] = useState(null);

  const choose = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title={t('common.language')}>
        <IconButton color="inherit" onClick={(e) => setAnchor(e.currentTarget)}><LanguageIcon /></IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {LANGUAGES.map((l) => (
          <MenuItem key={l.code} selected={i18n.language === l.code} onClick={() => choose(l.code)}>{l.label}</MenuItem>
        ))}
      </Menu>
      <Tooltip title={t('common.theme')}>
        <IconButton color="inherit" onClick={toggle}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
}
