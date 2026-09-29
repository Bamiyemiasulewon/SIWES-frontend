import { Alert, Button, Card, Divider, Grid, Group, NativeSelect, SegmentedControl, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../auth/AuthProvider';
import { ErrorState } from '../../components/common/StateViews';
import type { Department } from '../../types';

export default function NewRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [type, setType] = useState<'maintenance' | 'complaint'>('maintenance');
  const [form, setForm] = useState({
    category: '',
    building: '',
    room: '',
    priority: 'medium',
    title: '',
    description: '',
    course_code: '',
    is_anonymous: false,
  });

  const departmentsQuery = useQuery({
    queryKey: ['departments-for-request'],
    queryFn: async () => {
      console.log('[API]', '/departments', 'request');
      const res = await api.get<{ items: Department[] }>('/departments');
      console.log('[API]', '/departments', 'status', res.status);
      return res.data.items ?? [];
    },
  });

  const isStaff = user?.role === 'staff';

  const submit = async () => {
    const payload: Record<string, unknown> = {
      type,
      category: form.category,
      title: form.title,
      description: form.description,
      priority: form.priority,
      is_anonymous: form.is_anonymous,
      department_id: user?.department_id ?? departmentsQuery.data?.[0]?.id,
    };
    if (type === 'maintenance') {
      Object.assign(payload, { building: form.building, room: form.room });
    } else {
      if (form.course_code) payload.course_code = form.course_code;
    }

    console.log('[API]', '/requests', 'request', payload);
    const res = await api.post('/requests', payload);
    console.log('[API]', '/requests', 'status', res.status);
    navigate('/requests');
  };

  if (departmentsQuery.isLoading) {
    return <Text c="dimmed">Loading request form…</Text>;
  }

  if (departmentsQuery.isError) {
    const err = departmentsQuery.error as { response?: { status?: number }; message?: string };
    return <ErrorState status={err?.response?.status} message={err?.message ?? 'Failed to load departments for the request form.'} onRetry={() => void departmentsQuery.refetch()} />;
  }

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>New request</Text>
          <Text c="dimled" mt={6}>Submit a new maintenance or complaint request.</Text>
        </div>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius={6} p="lg">
            <Stack gap="md">
              <SegmentedControl
                fullWidth
                data={isStaff ? [{ value: 'maintenance', label: 'Maintenance' }] : [{ value: 'maintenance', label: 'Maintenance' }, { value: 'complaint', label: 'Complaint' }]}
                value={type}
                onChange={(value) => setType(value as 'maintenance' | 'complaint')}
              />

              {type === 'maintenance' ? (
                <>
                  <Grid>
                    <Grid.Col span={6}><NativeSelect label="Category" data={['electrical', 'plumbing', 'lab_equipment', 'hostel', 'furniture', 'other']} value={form.category} onChange={(e) => setForm({ ...form, category: e.currentTarget.value })} /></Grid.Col>
                    <Grid.Col span={6}><NativeSelect label="Priority" data={['low', 'medium', 'high', 'critical']} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.currentTarget.value })} /></Grid.Col>
                    <Grid.Col span={6}><TextInput label="Building" value={form.building} onChange={(e) => setForm({ ...form, building: e.currentTarget.value })} /></Grid.Col>
                    <Grid.Col span={6}><TextInput label="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.currentTarget.value })} /></Grid.Col>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid>
                    <Grid.Col span={6}><NativeSelect label="Category" data={['results', 'registration', 'fees', 'hostel', 'lecturer_conduct', 'other']} value={form.category} onChange={(e) => setForm({ ...form, category: e.currentTarget.value })} /></Grid.Col>
                    <Grid.Col span={6}><TextInput label="Course code" value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.currentTarget.value })} /></Grid.Col>
                  </Grid>
                  {form.category === 'lecturer_conduct' && (
                    <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                      This complaint can only be viewed by administrators.
                    </Alert>
                  )}
                </>
              )}

              <TextInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.currentTarget.value })} />
              <Textarea label="Description" minRows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.currentTarget.value })} />

              <Divider />

              <Text fw={600}>Visibility</Text>
              <Stack gap="sm">
                <Card withBorder p="sm" radius={4} style={{ cursor: 'pointer' }} onClick={() => setForm({ ...form, is_anonymous: false })}>
                  <Text fw={500}>Submit with my name</Text>
                </Card>
                <Card withBorder p="sm" radius={4} style={{ cursor: 'pointer' }} onClick={() => setForm({ ...form, is_anonymous: true })}>
                  <Text fw={500}>Submit anonymously</Text>
                  <Text c="dimmed" size="sm">Your identity is stored securely and officers will see “Anonymous”.</Text>
                </Card>
              </Stack>
              <Group justify="flex-end">
                <Button variant="default" onClick={() => navigate('/requests')}>Cancel</Button>
                <Button onClick={submit}>Submit request</Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius={6} p="lg" style={{ position: 'sticky', top: 20 }}>
            <Text fw={600} mb="sm">Before you submit</Text>
            <Text c="dimmed" size="sm">Requests are routed by type and department to the most appropriate team.</Text>
            <Text c="dimmed" size="sm" mt="sm">Staff review updates as soon as a request is assigned or resolved.</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
