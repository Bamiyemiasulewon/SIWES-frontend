import { Button, Card, Group, Text } from '@mantine/core';

export default function DepartmentsPage() {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Departments</Text>
          <Text c="dimmed" mt={6}>Manage School of Computing departments.</Text>
        </div>
        <Button>Add department</Button>
      </Group>
      <Card withBorder radius={6} p="md"><Text c="dimmed">Department administration view</Text></Card>
    </>
  );
}
