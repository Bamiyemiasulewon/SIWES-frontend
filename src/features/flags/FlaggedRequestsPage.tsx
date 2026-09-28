import { Card, Group, Text } from '@mantine/core';

export default function FlaggedRequestsPage() {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Flagged requests</Text>
          <Text c="dimmed" mt={6}>Review flagged reports and take action.</Text>
        </div>
      </Group>
      <Card withBorder radius={6} p="md"><Text c="dimmed">Flagged request management view</Text></Card>
    </>
  );
}
