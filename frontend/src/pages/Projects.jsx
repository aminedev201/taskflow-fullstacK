import { useCallback, useEffect, useState } from 'react';
import {
  Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  InputAdornment, LinearProgress, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/FormatListBulleted';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import useDebounce from '../hooks/useDebounce';
import SortCell from '../components/SortCell';
import FilterSelect from '../components/FilterSelect';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED'];
const STATUS_COLOR = { ACTIVE: 'primary', ON_HOLD: 'default', COMPLETED: 'success' };
const EMPTY = { name: '', description: '', status: 'ACTIVE' };

export default function Projects() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const q = useDebounce(search);
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects', {
        params: { page, size, sort: `${orderBy},${order}`, search: q || undefined, status: status || undefined },
      });
      setRows(data.content);
      setTotal(data.totalElements);
    } catch {
      toast(t('common.error'), 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, orderBy, order, q, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [q, status, size]);

  const onSort = (field) => {
    setOrder(orderBy === field && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const openForm = (row) => {
    setEditId(row?.id ?? null);
    setForm(row ? { name: row.name, description: row.description || '', status: row.status } : EMPTY);
    setOpen(true);
  };

  const save = async () => {
    try {
      if (editId) await api.put(`/projects/${editId}`, form);
      else await api.post('/projects', form);
      setOpen(false);
      toast(t('common.saved'));
      load();
    } catch {
      toast(t('common.error'), 'error');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/projects/${deleteId}`);
      setDeleteId(null);
      toast(t('common.deleted'));
      if (rows.length === 1 && page > 0) setPage(page - 1); else load();
    } catch {
      toast(t('common.error'), 'error');
    }
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={700}>{t('projects.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm(null)}>{t('projects.add')}</Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            size="small" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
          />
          <FilterSelect label={t('common.status')} value={status} onChange={setStatus}
            options={STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))} />
        </Stack>
      </Paper>

      <Paper variant="outlined">
        {loading && <LinearProgress />}
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <SortCell field="name" {...{ orderBy, order, onSort }}>{t('common.name')}</SortCell>
                <SortCell field="status" {...{ orderBy, order, onSort }}>{t('common.status')}</SortCell>
                <TableCell sx={{ minWidth: 160 }}>{t('projects.progress')}</TableCell>
                <SortCell field="createdAt" {...{ orderBy, order, onSort }}>{t('common.createdAt')}</SortCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => {
                const pct = r.taskCount ? Math.round((r.doneCount / r.taskCount) * 100) : 0;
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{r.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 320 }}>{r.description}</Typography>
                    </TableCell>
                    <TableCell><Chip size="small" color={STATUS_COLOR[r.status]} label={t(`status.${r.status}`)} /></TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {t('projects.tasks')}: {r.doneCount}/{r.taskCount}
                      </Typography>
                      <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3 }} />
                    </TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleDateString(i18n.language)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title={t('common.viewTasks')}>
                        <IconButton onClick={() => navigate(`/tasks?projectId=${r.id}`)}><ListIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.edit')}><IconButton onClick={() => openForm(r)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title={t('common.delete')}><IconButton color="error" onClick={() => setDeleteId(r.id)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>{t('common.noData')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={size}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('common.of')} ${count}`}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? t('projects.edit') : t('projects.add')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label={t('common.name')} value={form.name} required autoFocus
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label={t('common.description')} value={form.description} multiline minRows={3}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <TextField select label={t('common.status')} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={save} disabled={!form.name.trim()}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </Stack>
  );
}
