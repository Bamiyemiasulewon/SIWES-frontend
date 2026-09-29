import { Badge, Card, Group, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';

type UserListItem = {
  id: number;
  name: string;
  email?: string;
  role?: string;
  department_id?: number | null;
  matric_number?: string | null;
};

export default function UsersPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('[API]', '/users', 'request');
      const res = await api.get<{ items: UserListItem[] }>('/users');
      console.log('[API]', '/users', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading users…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load users.'} onRetry={() => void refetch()} />;
  }

  const users = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Users</Text>
          <Text c="dimmed" mt={6}>Manage user roles and scope.</Text>
        </div>
      </Group>

      {users.length ? (
        <Card withBorder radius={6} p="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Matric number</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.email ?? 'No email'}</Table.Td>
                  <Table.Td><Badge>{user.role ?? 'No role'}</Badge></Table.Td>
                  <Table.Td>{user.matric_number ?? 'No matric number'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <EmptyState title="No users" description="There are no users returned by the API." />
      )}
    </>
  );
}
