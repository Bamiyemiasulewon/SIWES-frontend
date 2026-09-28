import { Button, Card, Group, Text } from '@mantine/core';

export default function UsersPage() {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Users</Text>
          <Text c="dimmed" mt={6}>Manage user roles and scope.</Text>
        </div>
        <Button>Create user</Button>
      </Group>
      <Card withBorder radius={6} p="md"><Text c="dimmed">User administration view</Text></Card>
    </>
  );
}
