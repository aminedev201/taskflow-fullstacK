import { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/FolderOpenOutlined';
import TaskIcon from '@mui/icons-material/AssignmentOutlined';
import DoneIcon from '@mui/icons-material/CheckCircleOutline';
import AlarmIcon from '@mui/icons-material/AlarmOutlined';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useToast } from '../components/Toast';

const COLORS = {
  TODO: '#9E9E9E', IN_PROGRESS: '#FB8C00', DONE: '#43A047',
  LOW: '#FFCC80', MEDIUM: '#FB8C00', HIGH: '#D84315',
  ACTIVE: '#FB8C00', ON_HOLD: '#9E9E9E', COMPLETED: '#43A047',
};

function StatCard({ icon, label, value, color }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: color, color: '#fff', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography variant="h4" fontWeight={700} lineHeight={1}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Paper>
  );
}

function ChartCard({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography fontWeight={600} sx={{ mb: 1 }}>{title}</Typography>
      <Box sx={{ height: 300, direction: 'ltr' }}>{children}</Box>
    </Paper>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then((r) => setStats(r.data)).catch(() => toast(t('common.error'), 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <Box sx={{ display: 'grid', placeItems: 'center', height: 300 }}><CircularProgress /></Box>;

  const toData = (map, ns) => Object.entries(map).map(([k, v]) => ({ key: k, name: t(`${ns}.${k}`), value: v }));
  const pie = (data) => (
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
          {data.map((d) => <Cell key={d.key} fill={COLORS[d.key]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const perProject = stats.tasksPerProject.map((p) => ({
    name: p.project, TODO: p.todo, IN_PROGRESS: p.inProgress, DONE: p.done,
  }));
  const projStatus = toData(stats.projectsByStatus, 'status');

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>{t('dashboard.title')}</Typography>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <StatCard icon={<FolderIcon />} label={t('dashboard.totalProjects')} value={stats.totalProjects} color="#EF6C00" />
        <StatCard icon={<TaskIcon />} label={t('dashboard.totalTasks')} value={stats.totalTasks} color="#8D6E63" />
        <StatCard icon={<DoneIcon />} label={t('dashboard.completed')} value={stats.completedTasks} color="#43A047" />
        <StatCard icon={<AlarmIcon />} label={t('dashboard.overdue')} value={stats.overdueTasks} color="#D84315" />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        <ChartCard title={t('dashboard.tasksByStatus')}>{pie(toData(stats.tasksByStatus, 'status'))}</ChartCard>
        <ChartCard title={t('dashboard.tasksByPriority')}>{pie(toData(stats.tasksByPriority, 'priority'))}</ChartCard>
        <ChartCard title={t('dashboard.tasksPerProject')}>
          <ResponsiveContainer>
            <BarChart data={perProject}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} tickFormatter={(v) => (v.length > 10 ? `${v.slice(0, 9)}…` : v)} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(v) => t(`status.${v}`)} />
              {['TODO', 'IN_PROGRESS', 'DONE'].map((k) => (
                <Bar key={k} dataKey={k} stackId="a" fill={COLORS[k]} name={k} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t('dashboard.projectsByStatus')}>
          <ResponsiveContainer>
            <BarChart data={projStatus}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {projStatus.map((d) => <Cell key={d.key} fill={COLORS[d.key]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Stack>
  );
}
