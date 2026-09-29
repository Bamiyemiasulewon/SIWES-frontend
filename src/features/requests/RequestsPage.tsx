import { Badge, Button, Card, Group, Select, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { EmptyState, ErrorState } from '../../components/common/StateViews';
import type { PaginationResponse, RequestItem } from '../../types';

const statuses = ['submitted', 'assigned', 'in_progress', 'resolved', 'reopened', 'closed'];
const types = ['maintenance', 'complaint'];

export default function RequestsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const params = new URLSearchParams();
  if (statusFilter !== 'all') params.set('status', statusFilter);
  if (typeFilter !== 'all') params.set('type', typeFilter);
  const query = params.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['requests', query],
    queryFn: async () => {
      const url = `/requests${query ? `?${query}` : ''}`;
      console.log('[API]', url, 'request');
      const res = await api.get<PaginationResponse<RequestItem>>(url);
      console.log('[API]', url, 'status', res.status);
      return res.data.items ?? [];
    },
  });

  if (isLoading) {
    return <Text c="dimmed">Loading requests…</Text>;
  }

  if (isError) {
    const err = error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load requests.'} onRetry={() => void refetch()} />;
  }

  const items = data ?? [];

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>My requests</Text>
          <Text c="dimmed" mt={6}>Track your service requests and complaints.</Text>
        </div>
        <Button onClick={() => navigate('/requests/new')}>New request</Button>
      </Group>

      <Card withBorder p="md" radius={6}>
        <Group gap="md" mb="md">
          <Select label="Status" data={[{ value: 'all', label: 'All' }, ...statuses.map((status) => ({ value: status, label: status }))]} value={statusFilter} onChange={(value) => setStatusFilter(value ?? 'all')} />
          <Select label="Type" data={[{ value: 'all', label: 'All' }, ...types.map((type) => ({ value: type, label: type }))]} value={typeFilter} onChange={(value) => setTypeFilter(value ?? 'all')} />
        </Group>

        {items.length ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Reference</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Last updated</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item) => (
                <Table.Tr key={item.id} onClick={() => navigate(`/requests/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.Td>{item.title}</Table.Td>
                  <Table.Td>{item.type}</Table.Td>
                  <Table.Td>{item.category ?? 'No category'}</Table.Td>
                  <Table.Td><Badge color={item.status === 'resolved' ? 'green' : item.status === 'assigned' ? 'blue' : item.status === 'in_progress' ? 'yellow' : item.status === 'reopened' ? 'orange' : item.status === 'closed' ? 'gray' : 'gray'}>{item.status}</Badge></Table.Td>
                  <Table.Td>{item.priority ?? 'No priority'}</Table.Td>
                  <Table.Td>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'No date'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <EmptyState title="No requests" description="There are no requests matching the current filters." />
        )}
      </Card>
    </>
  );
}
