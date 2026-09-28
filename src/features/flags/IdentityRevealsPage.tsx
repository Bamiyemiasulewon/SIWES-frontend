import { Card, Text } from '@mantine/core';

export default function IdentityRevealsPage() {
  return (
    <>
      <Text size="22px" fw={600}>Identity reveals</Text>
      <Text c="dimmed" mt={6}>Audit log of confirmed identity reveal actions.</Text>
      <Card withBorder radius={6} p="md" mt="lg"><Text c="dimmed">Identity reveal audit log</Text></Card>
    </>
  );
}
