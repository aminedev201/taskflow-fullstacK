import { useCallback, useEffect, useState } from 'react';
import {
  Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment,
  LinearProgress, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import useDebounce from '../hooks/useDebounce';
import SortCell from '../components/SortCell';
import FilterSelect from '../components/FilterSelect';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_COLOR = { TODO: 'default', IN_PROGRESS: 'warning', DONE: 'success' };
const PRIORITY_COLOR = { LOW: 'info', MEDIUM: 'warning', HIGH: 'error' };
const EMPTY = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', projectId: '' };

export default function Tasks() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [sp, setSp] = useSearchParams();
  const projectId = sp.get('projectId') || '';
  const setProjectId = (v) => {
    const next = new URLSearchParams(sp);
    if (v) next.set('projectId', v); else next.delete('projectId');
    setSp(next);
  };

  const [projects, setProjects] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const q = useDebounce(search);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.get('/projects', { params: { size: 200, sort: 'name,asc' } })
      .then((r) => setProjects(r.data.content))
      .catch(() => toast(t('common.error'), 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: {
          page, size, sort: `${orderBy},${order}`,
          search: q || undefined, status: status || undefined,
          priority: priority || undefined, projectId: projectId || undefined,
        },
      });
      setRows(data.content);
      setTotal(data.totalElements);
    } catch {
      toast(t('common.error'), 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, orderBy, order, q, status, priority, projectId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [q, status, priority, projectId, size]);

  const onSort = (field) => {
    setOrder(orderBy === field && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const openForm = (row) => {
    setEditId(row?.id ?? null);
    setForm(
      row
        ? { title: row.title, description: row.description || '', status: row.status, priority: row.priority,
            dueDate: row.dueDate || '', projectId: String(row.projectId) }
        : { ...EMPTY, projectId: projectId || (projects[0] ? String(projects[0].id) : '') }
    );
    setOpen(true);
  };

  const save = async () => {
    const payload = { ...form, projectId: Number(form.projectId), dueDate: form.dueDate || null };
    try {
      if (editId) await api.put(`/tasks/${editId}`, payload);
      else await api.post('/tasks', payload);
      setOpen(false);
      toast(t('common.saved'));
      load();
    } catch {
      toast(t('common.error'), 'error');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/tasks/${deleteId}`);
      setDeleteId(null);
      toast(t('common.deleted'));
      if (rows.length === 1 && page > 0) setPage(page - 1); else load();
    } catch {
      toast(t('common.error'), 'error');
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={700}>{t('tasks.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm(null)} disabled={!projects.length}>
          {t('tasks.add')}
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
          />
          <FilterSelect label={t('common.project')} value={projectId} onChange={setProjectId}
            options={projects.map((p) => ({ value: String(p.id), label: p.name }))} />
          <FilterSelect label={t('common.status')} value={status} onChange={setStatus}
            options={STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))} />
          <FilterSelect label={t('common.priority')} value={priority} onChange={setPriority}
            options={PRIORITIES.map((p) => ({ value: p, label: t(`priority.${p}`) }))} />
        </Stack>
      </Paper>

      <Paper variant="outlined">
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <SortCell field="title" {...{ orderBy, order, onSort }}>{t('common.title')}</SortCell>
                <SortCell field="project.name" {...{ orderBy, order, onSort }}>{t('common.project')}</SortCell>
                <SortCell field="status" {...{ orderBy, order, onSort }}>{t('common.status')}</SortCell>
                <SortCell field="priority" {...{ orderBy, order, onSort }}>{t('common.priority')}</SortCell>
                <SortCell field="dueDate" {...{ orderBy, order, onSort }}>{t('common.dueDate')}</SortCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => {
                const overdue = r.dueDate && r.dueDate < today && r.status !== 'DONE';
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{r.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 280 }}>{r.description}</Typography>
                    </TableCell>
                    <TableCell>{r.projectName}</TableCell>
                    <TableCell><Chip size="small" color={STATUS_COLOR[r.status]} label={t(`status.${r.status}`)} /></TableCell>
                    <TableCell><Chip size="small" variant="outlined" color={PRIORITY_COLOR[r.priority]} label={t(`priority.${r.priority}`)} /></TableCell>
                    <TableCell>
                      {r.dueDate ? new Date(r.dueDate).toLocaleDateString(i18n.language) : '—'}
                      {overdue && <Chip size="small" color="error" label={t('common.overdue')} sx={{ marginInlineStart: 1 }} />}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title={t('common.edit')}><IconButton onClick={() => openForm(r)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title={t('common.delete')}><IconButton color="error" onClick={() => setDeleteId(r.id)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>{t('common.noData')}</TableCell></TableRow>
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
        <DialogTitle>{editId ? t('tasks.edit') : t('tasks.add')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label={t('common.title')} value={form.title} required autoFocus
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField label={t('common.description')} value={form.description} multiline minRows={3}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <TextField select label={t('common.project')} value={form.projectId} required
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              {projects.map((p) => <MenuItem key={p.id} value={String(p.id)}>{p.name}</MenuItem>)}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select fullWidth label={t('common.status')} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>)}
              </TextField>
              <TextField select fullWidth label={t('common.priority')} value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{t(`priority.${p}`)}</MenuItem>)}
              </TextField>
            </Stack>
            <TextField type="date" label={t('common.dueDate')} value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={save} disabled={!form.title.trim() || !form.projectId}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </Stack>
  );
}
