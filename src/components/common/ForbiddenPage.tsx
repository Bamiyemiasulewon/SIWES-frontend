import { Button, Card, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <Card withBorder radius={6} maw={420} mx="auto" mt="xl" p="xl">
      <Stack>
        <Text fw={600} size="xl">Access denied</Text>
        <Text c="dimmed">You do not have permission to view this page.</Text>
        <Button component={Link} to="/login" variant="light">Return to sign in</Button>
      </Stack>
    </Card>
  );
}
