import { useState } from 'react';
import { Alert, Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import TaskIcon from '@mui/icons-material/TaskAltOutlined';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import HeaderControls from '../components/HeaderControls';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2,
        background: (th) =>
          th.palette.mode === 'light'
            ? 'linear-gradient(135deg,#FFE0B2 0%,#FAF6F2 60%)'
            : 'linear-gradient(135deg,#3b2108 0%,#14110F 60%)',
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, insetInlineEnd: 12 }}><HeaderControls /></Box>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420 }}>
        <Stack component="form" onSubmit={submit} spacing={2.5} alignItems="stretch">
          <Stack alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 56, height: 56 }}>
              <TaskIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={700}>{t('auth.title')}</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">{t('auth.subtitle')}</Typography>
          </Stack>
          {error && <Alert severity="error">{t('auth.invalid')}</Alert>}
          <TextField label={t('auth.username')} value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username" autoFocus required />
          <TextField label={t('auth.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" required />
          <Button type="submit" variant="contained" size="large" disabled={loading}>{t('auth.signIn')}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
