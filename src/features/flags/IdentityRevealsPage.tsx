import { Card, Group, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';

type IdentityRevealItem = {
  id: number;
  request_id?: number;
  admin_id?: number;
  reason?: string | null;
  revealed_at?: string | null;
};

export default function IdentityRevealsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['identity-reveals'],
    queryFn: async () => {
      console.log('[API]', '/requests/identity-reveals', 'request');
      const res = await api.get<{ items: IdentityRevealItem[] }>('/requests/identity-reveals');
      console.log('[API]', '/requests/identity-reveals', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading identity reveals…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load identity reveals.'} onRetry={() => void refetch()} />;
  }

  const reveals = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Identity reveals</Text>
          <Text c="dimmed" mt={6}>Audit log of confirmed identity reveal actions.</Text>
        </div>
      </Group>

      {reveals.length ? (
        <Card withBorder radius={6} p="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Request ID</Table.Th>
                <Table.Th>Admin ID</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Revealed at</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reveals.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.Td>{item.request_id ?? 'No request ID'}</Table.Td>
                  <Table.Td>{item.admin_id ?? 'No admin ID'}</Table.Td>
                  <Table.Td>{item.reason ?? 'No reason'}</Table.Td>
                  <Table.Td>{item.revealed_at ?? 'No timestamp'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <EmptyState title="No identity reveals" description="There are no identity reveals returned by the API." />
      )}
    </>
  );
}
