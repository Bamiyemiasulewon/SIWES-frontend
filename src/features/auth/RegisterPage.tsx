import { Button, Card, Grid, Select, Stack, Text, TextInput, NumberInput, PasswordInput, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { Department } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  matric_number: z.string().min(2, 'Matric number is required'),
  department_id: z.number({ error: 'Department is required' }),
  level: z.number().min(100).max(600),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Confirm your password'),
}).refine((values) => values.password === values.confirm_password, { message: 'Passwords do not match', path: ['confirm_password'] });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    api.get<{ items: Department[] }>('/departments').then((result) => {
      setDepartments(result.data.items ?? []);
    }).catch(() => {
      notifications.show({ title: 'Departments unavailable', message: 'Unable to load departments.', color: 'yellow' });
    });
  }, []);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      matric_number: '',
      department_id: undefined as number | undefined,
      level: 100,
      password: '',
      confirm_password: '',
    },
    validate: zodResolver(registerSchema),
    transformValues: (values) => ({
      ...values,
      department_id: Number(values.department_id),
      level: Number(values.level),
    }),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        matric_number: values.matric_number,
        department_id: Number(values.department_id),
        level: Number(values.level),
        password: values.password,
      });
      notifications.show({ title: 'Account created', message: 'Your student account has been created.', color: 'green' });
      navigate('/login');
    } catch (error: any) {
      notifications.show({ title: 'Registration failed', message: error?.response?.data?.message || 'Unable to create account', color: 'red' });
    }
  });

  return (
    <Box w={480}>
      <Stack gap={20}>
        <Box ta="center">
          <Text fw={600} size="lg">Campus ServiceDesk</Text>
          <Text c="dimmed" size="xs">School of Computing</Text>
        </Box>
        <Card withBorder radius={6} p="xl" bg="white">
          <Stack gap="md">
            <Text fw={600} size="xl">Create account</Text>
            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Full name" {...form.getInputProps('name')} error={form.errors.name} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Email" {...form.getInputProps('email')} error={form.errors.email} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Matric number" {...form.getInputProps('matric_number')} error={form.errors.matric_number} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Department"
                  data={departments.map((d) => ({ value: String(d.id), label: d.name }))}
                  value={form.values.department_id ? String(form.values.department_id) : null}
                  onChange={(value) => form.setFieldValue('department_id', Number(value))}
                  error={form.errors.department_id}
                  placeholder="Select department"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput label="Level" min={100} max={600} step={100} {...form.getInputProps('level')} error={form.errors.level} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <PasswordInput label="Password" {...form.getInputProps('password')} error={form.errors.password} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <PasswordInput label="Confirm password" {...form.getInputProps('confirm_password')} error={form.errors.confirm_password} />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit()} fullWidth type="submit">Create account</Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
