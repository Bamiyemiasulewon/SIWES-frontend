import { BarChart, DonutChart, LineChart } from '@mantine/charts';
import { Card, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState, formatApiValue } from '../../components/common/StateViews';
import { useAuth } from '../../auth/AuthProvider';

type DashboardPayload = {
  total_requests?: number;
  by_status?: Record<string, number>;
  by_type?: Record<string, number>;
  by_priority?: Record<string, number>;
  by_category?: Record<string, number>;
  average_resolution_hours?: number;
  flagged_count?: number;
  reopened_count?: number;
  unassigned_count?: number;
  my_assigned_count?: number;
  requests_per_day_last_30_days?: Record<string, number>;
  by_department?: Record<string, number>;
  top_buildings?: Record<string, number>;
  requests?: Array<{ id: number; title: string; status?: string; priority?: string; type?: string; assigned_to?: number | null }>;
};

export default function DashboardPage() {
  const { user } = useAuth();

  const endpoint = user?.role === 'student' || user?.role === 'staff'
    ? '/dashboard/student'
    : user?.role === 'maintenance_officer' || user?.role === 'complaint_officer'
      ? '/dashboard/officer'
      : '/dashboard/admin';

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', endpoint],
    queryFn: async () => {
      console.log('[API]', endpoint, 'request');
      const res = await api.get<DashboardPayload>(endpoint);
      console.log('[API]', endpoint, 'status', res.status);
      return res.data;
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading dashboard…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load dashboard data.'} onRetry={() => void refetch()} />;
  }

  const payload = data ?? {} as DashboardPayload;
  const statusBreakdown = payload.by_status ?? {};
  const typeBreakdown = payload.by_type ?? {};
  const statusChart = Object.entries(statusBreakdown).map(([name, value]) => ({ name, value }));
  const typeChart = Object.entries(typeBreakdown).map(([name, value]) => ({ name, value, color: name === 'maintenance' ? '#0F5C4D' : '#6B6B63' }));
  const lineSeries = Object.entries(payload.requests_per_day_last_30_days ?? {}).map(([date, value]) => ({ date, value }));
  const statCards = [
    { label: 'Total requests', value: payload.total_requests ?? 0 },
    { label: 'Unassigned', value: payload.unassigned_count ?? 0 },
    { label: 'Flagged', value: payload.flagged_count ?? 0 },
    { label: 'Reopened', value: payload.reopened_count ?? 0 },
    { label: 'Average resolution hours', value: payload.average_resolution_hours ?? 0 },
  ];

  return (
    <>
      <Text size="22px" fw={600}>Dashboard</Text>

      <SimpleGrid cols={5} mt="lg">
        {statCards.map((item) => (
          <Card key={item.label} withBorder radius={6} p="md">
            <Text c="dimmed" size="xs" tt="uppercase" style={{ letterSpacing: '0.08em' }}>{item.label}</Text>
            <Title order={3} mt="xs">{formatApiValue(item.value)}</Title>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={2} mt="xl">
        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests by status</Text>
          {statusChart.length ? (
            <BarChart h={250} data={statusChart} dataKey="name" series={[{ name: 'value', color: '#0F5C4D' }]} />
          ) : (
            <EmptyState title="No status data" description="This dashboard has no request status data yet." />
          )}
        </Paper>

        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests by type</Text>
          {typeChart.length ? (
            <DonutChart h={250} data={typeChart} />
          ) : (
            <EmptyState title="No type data" description="No request type data returned by the API." />
          )}
        </Paper>

        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests per day (last 30 days)</Text>
          {lineSeries.length ? (
            <LineChart h={250} data={lineSeries} dataKey="date" series={[{ name: 'value', color: '#0F5C4D' }]} />
          ) : (
            <EmptyState title="No daily data" description="No requests were submitted in the past 30 days." />
          )}
        </Paper>

        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Request priorities</Text>
          {Object.keys(payload.by_priority ?? {}).length ? (
            <BarChart h={250} data={Object.entries(payload.by_priority ?? {}).map(([name, value]) => ({ name, value }))} dataKey="name" series={[{ name: 'value', color: '#0F5C4D' }]} />
          ) : (
            <EmptyState title="No priority data" description="No priority data is available from the API." />
          )}
        </Paper>
      </SimpleGrid>

      {payload.requests?.length ? (
        <Paper withBorder p="md" radius={6} mt="xl">
          <Text fw={600} mb="sm">Recent requests</Text>
          {payload.requests.slice(0, 5).map((request) => (
            <Card key={request.id} withBorder radius={6} p="sm" mt="sm">
              <Text fw={600}>{request.title}</Text>
              <Text c="dimmed" size="sm">{request.type ?? 'Unknown'} · {request.status ?? 'No status'} · {request.priority ?? 'No priority'}</Text>
            </Card>
          ))}
        </Paper>
      ) : null}
    </>
  );
}
