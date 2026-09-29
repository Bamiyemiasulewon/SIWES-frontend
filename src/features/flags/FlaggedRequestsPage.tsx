import { Badge, Card, Group, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';

type FlaggedItem = {
  id: number;
  title?: string;
  is_flagged?: boolean;
  flag_type?: string | null;
  flag_reason?: string | null;
  flagged_by?: number | null;
};

export default function FlaggedRequestsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['flagged'],
    queryFn: async () => {
      console.log('[API]', '/requests', 'request');
      const res = await api.get<{ items: FlaggedItem[] }>('/requests?is_flagged=1');
      console.log('[API]', '/requests?is_flagged=1', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading flagged requests…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load flagged requests.'} onRetry={() => void refetch()} />;
  }

  const flagged = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Flagged requests</Text>
          <Text c="dimmed" mt={6}>Review flagged reports and take action.</Text>
        </div>
      </Group>

      {flagged.length ? (
        <Card withBorder radius={6} p="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Flag type</Table.Th>
                <Table.Th>Reason</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {flagged.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.Td>{item.title ?? 'No title'}</Table.Td>
                  <Table.Td><Badge>{item.flag_type ?? 'No flag type'}</Badge></Table.Td>
                  <Table.Td>{item.flag_reason ?? 'No reason'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <EmptyState title="No flagged requests" description="There are no flagged requests from the API." />
      )}
    </>
  );
}
