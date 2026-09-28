import { Button, Card, Divider, Group, SegmentedControl, Text, TextInput, PasswordInput, Stack, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { IconLock, IconUserCircle } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { useAuth } from '../../auth/AuthProvider';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Password required'),
  role: z.enum(['student', 'staff']),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const form = useForm({
    initialValues: { identifier: '', password: '', role: 'student' as 'student' | 'staff' },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await login({ identifier: values.identifier, password: values.password });
      const resolvedUser = user ?? JSON.parse(localStorage.getItem('campus-service-desk-user') || 'null');
      if (resolvedUser?.role === 'admin') navigate('/dashboard');
      else if (resolvedUser?.role === 'maintenance_officer' || resolvedUser?.role === 'complaint_officer') navigate('/queue');
      else navigate('/requests');
    } catch (error: any) {
      notifications.show({ title: 'Sign in failed', message: error?.response?.data?.message || 'Unable to sign in', color: 'red' });
    }
  });

  return (
    <Stack gap={20} w={400}>
      <Box ta="center">
        <Text fw={600} size="lg">Campus ServiceDesk</Text>
        <Text c="dimmed" size="xs">School of Computing</Text>
      </Box>
      <Card withBorder radius={6} p="xl" bg="white">
        <Stack gap="lg">
          <Text fw={600} size="xl">Sign in</Text>
          <SegmentedControl
            fullWidth
            data={[
              { label: 'Student', value: 'student' },
              { label: 'Staff', value: 'staff' },
            ]}
            value={form.values.role}
            onChange={(value) => form.setFieldValue('role', value as 'student' | 'staff')}
          />
          <TextInput
            label={form.values.role === 'student' ? 'Matric number or email' : 'Staff email'}
            placeholder={form.values.role === 'student' ? 'e.g. SWE1234 or name@school.com' : 'name@school.com'}
            leftSection={<IconUserCircle size={16} stroke={1.5} />}
            {...form.getInputProps('identifier')}
            error={form.errors.identifier}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            leftSection={<IconLock size={16} stroke={1.5} />}
            {...form.getInputProps('password')}
            error={form.errors.password}
          />
          <Button type="submit" fullWidth onClick={() => handleSubmit()}>
            Sign in
          </Button>
          <Link to="/register" style={{ textAlign: 'center', color: '#0F5C4D', textDecoration: 'underline' }}>
            <Text size="sm">Create a student account</Text>
          </Link>
        </Stack>
      </Card>

      <Group justify="center" gap={0} grow>
        <Text size="xs" c="dimmed" ta="center" px="sm">Report a facility problem</Text>
        <Divider orientation="vertical" size="sm" />
        <Text size="xs" c="dimmed" ta="center" px="sm">Submit a complaint</Text>
        <Divider orientation="vertical" size="sm" />
        <Text size="xs" c="dimmed" ta="center" px="sm">Track it to resolution</Text>
      </Group>
    </Stack>
  );
}
