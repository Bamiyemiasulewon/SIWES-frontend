import { Badge, Card, Group, Table, Tabs, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';
import { useAuth } from '../../auth/AuthProvider';

type QueueItem = {
  id: number;
  title: string;
  status?: string;
  priority?: string;
  type?: string;
  assigned_to?: number | null;
  department_id?: number | null;
};

export default function QueuePage() {
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['queue', user?.role],
    enabled: !!user,
    queryFn: async () => {
      console.log('[API]', '/requests', 'request');
      const res = await api.get<{ items: QueueItem[] }>('/requests');
      console.log('[API]', '/requests', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading queue…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load the queue.'} onRetry={() => void refetch()} />;
  }

  const items = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Queue</Text>
          <Text c="dimmed" mt={6}>Review and act on outstanding requests.</Text>
        </div>
      </Group>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="unassigned">Unassigned</Tabs.Tab>
          <Tabs.Tab value="assigned">Assigned</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="md">
          <Card withBorder radius={6} p="md">
            {items.length ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Priority</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>#{item.id}</Table.Td>
                      <Table.Td>{item.title}</Table.Td>
                      <Table.Td>{item.type ?? 'No type'}</Table.Td>
                      <Table.Td><Badge color={item.status === 'resolved' ? 'green' : item.status === 'assigned' ? 'blue' : item.status === 'in_progress' ? 'yellow' : item.status === 'reopened' ? 'orange' : item.status === 'closed' ? 'gray' : 'gray'}>{item.status ?? 'No status'}</Badge></Table.Td>
                      <Table.Td>{item.priority ?? 'No priority'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <EmptyState title="No queue items" description="There are no requests returned by the API for this queue." />
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="unassigned" pt="md">
          <Card withBorder radius={6} p="md">
            {items.filter((item) => !item.assigned_to).length ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.filter((item) => !item.assigned_to).map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>#{item.id}</Table.Td>
                      <Table.Td>{item.title}</Table.Td>
                      <Table.Td>{item.status ?? 'No status'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <EmptyState title="No unassigned requests" description="There are no unassigned requests in the queue." />
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="assigned" pt="md">
          <Card withBorder radius={6} p="md">
            {items.filter((item) => item.assigned_to !== null && item.assigned_to !== undefined).length ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Assigned to</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.filter((item) => item.assigned_to !== null && item.assigned_to !== undefined).map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>#{item.id}</Table.Td>
                      <Table.Td>{item.title}</Table.Td>
                      <Table.Td>{item.assigned_to ?? 'No assignee'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <EmptyState title="No assigned requests" description="There are no assigned requests in the queue." />
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
