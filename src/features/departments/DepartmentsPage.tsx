import { Card, Group, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';

type DepartmentListItem = {
  id: number;
  name: string;
  description?: string | null;
};

export default function DepartmentsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      console.log('[API]', '/departments', 'request');
      const res = await api.get<{ items: DepartmentListItem[] }>('/departments');
      console.log('[API]', '/departments', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading departments…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load departments.'} onRetry={() => void refetch()} />;
  }

  const departments = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Departments</Text>
          <Text c="dimmed" mt={6}>Manage School of Computing departments.</Text>
        </div>
      </Group>

      {departments.length ? (
        <Card withBorder radius={6} p="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {departments.map((department) => (
                <Table.Tr key={department.id}>
                  <Table.Td>{department.id}</Table.Td>
                  <Table.Td>{department.name}</Table.Td>
                  <Table.Td>{department.description ?? 'No description'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <EmptyState title="No departments" description="There are no departments returned by the API." />
      )}
    </>
  );
}
