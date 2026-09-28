import { Button, Card, Group, Text } from '@mantine/core';

export default function AssetsPage() {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Assets</Text>
          <Text c="dimmed" mt={6}>Manage campus assets and equipment.</Text>
        </div>
        <Button>Add asset</Button>
      </Group>
      <Card withBorder radius={6} p="md"><Text c="dimmed">Assets administration view</Text></Card>
    </>
  );
}
