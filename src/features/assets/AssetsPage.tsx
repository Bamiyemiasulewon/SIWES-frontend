import { Card, Group, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';

type AssetListItem = {
  id: number;
  name: string;
  type?: string;
  status?: string;
  building?: string | null;
  room?: string | null;
  department_id?: number | null;
};

export default function AssetsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      console.log('[API]', '/assets', 'request');
      const res = await api.get<{ items: AssetListItem[] }>('/assets');
      console.log('[API]', '/assets', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading assets…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load assets.'} onRetry={() => void refetch()} />;
  }

  const assets = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Assets</Text>
          <Text c="dimmed" mt={6}>Manage campus assets and equipment.</Text>
        </div>
      </Group>

      {assets.length ? (
        <Card withBorder radius={6} p="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Location</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {assets.map((asset) => (
                <Table.Tr key={asset.id}>
                  <Table.Td>{asset.id}</Table.Td>
                  <Table.Td>{asset.name}</Table.Td>
                  <Table.Td>{asset.type ?? 'No type'}</Table.Td>
                  <Table.Td>{asset.status ?? 'No status'}</Table.Td>
                  <Table.Td>{asset.building ?? 'No building'} / {asset.room ?? 'No room'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <EmptyState title="No assets" description="There are no assets returned by the API." />
      )}
    </>
  );
}
