import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Tooltip, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import FolderIcon from '@mui/icons-material/FolderOpenOutlined';
import TaskIcon from '@mui/icons-material/TaskAltOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import HeaderControls from './HeaderControls';

const DRAWER_WIDTH = 250;

const NAV = [
  { to: '/', key: 'nav.dashboard', icon: <DashboardIcon />, end: true },
  { to: '/projects', key: 'nav.projects', icon: <FolderIcon /> },
  { to: '/tasks', key: 'nav.tasks', icon: <TaskIcon /> },
];

export default function Layout() {
  const { t } = useTranslation();
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 36, height: 36 }}>
          <TaskIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography fontWeight={700} lineHeight={1.1}>{t('app.name')}</Typography>
          <Typography variant="caption" color="text.secondary">{t('app.subtitle')}</Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ p: 1.5, flexGrow: 1 }}>
        {NAV.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2, mb: 0.5,
              '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } },
              '&.active:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.key)} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <HeaderControls />
            <Typography sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} color="text.secondary">{username}</Typography>
            <Tooltip title={t('auth.logout')}>
              <IconButton color="inherit" onClick={() => { logout(); navigate('/login'); }}><LogoutIcon /></IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
