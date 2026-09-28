import { Alert, Badge, Button, Card, Divider, Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../auth/AuthProvider';
import type { HistoryEntry, RequestItem } from '../../types';

export default function RequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get<{ request: RequestItem }>(`/requests/${id}`).then((res) => setRequest(res.data.request));
    api.get<{ items: HistoryEntry[] }>(`/requests/${id}/history`).then((res) => setHistory(res.data.items ?? []));
  }, [id]);

  if (!request) return null;

  const isOwner = user?.id === request.created_by;

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>{request.title}</Text>
          <Text c="dimmed" mt={6}>{request.id}</Text>
        </div>
        <Badge>{request.status}</Badge>
      </Group>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20 }}>
        <Stack gap="md">
          <Card withBorder radius={6} p="lg">
            <Text fw={600} mb="sm">Description</Text>
            <Text c="dimmed">{request.description}</Text>
            {request.resolution_notes && (
              <>
                <Divider my="md" />
                <Text fw={600}>Resolution notes</Text>
                <Text mt="xs">{request.resolution_notes}</Text>
              </>
            )}
          </Card>

          {request.is_flagged && (
            <Alert color="red" title="Flagged">
              Type: {request.flag_type} — {request.flag_reason}
            </Alert>
          )}
          {request.identity_revealed && (
            <Alert color="blue" title="Identity revealed">
              This request has been reviewed and the author identity has been revealed.
            </Alert>
          )}
        </Stack>

        <Stack gap="md">
          <Card withBorder radius={6} p="lg">
            <Text fw={600}>Actions</Text>
            {isOwner && request.status === 'resolved' && (
              <Button mt="md" color="orange" fullWidth>Reopen request</Button>
            )}
          </Card>

          <Card withBorder radius={6} p="lg">
            <Text fw={600}>History</Text>
            <Stack mt="md">
              {history.map((entry) => (
                <div key={entry.id}>
                  <Text size="sm" fw={500}>{entry.field_changed}</Text>
                  <Text size="xs" c="dimmed">{entry.note ?? 'Updated'} </Text>
                </div>
              ))}
            </Stack>
          </Card>
        </Stack>
      </div>
    </>
  );
}
