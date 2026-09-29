import { Button, Card, Group, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconInbox } from '@tabler/icons-react';

export function ErrorState({
  title = 'Error loading data',
  status,
  message,
  onRetry,
}: {
  title?: string;
  status?: number | string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Card withBorder radius={8} p="lg">
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon color="red" variant="light" radius="xl">
          <IconAlertTriangle size={18} />
        </ThemeIcon>
        <div>
          <Text fw={600}>{title}</Text>
          {status ? (
            <Text c="dimmed" size="sm" mt={4}>HTTP status: {status}</Text>
          ) : null}
          <Text c="dimmed" size="sm" mt={6}>{message ?? 'The API request failed. Please try again.'}</Text>
          {onRetry ? (
            <Button mt="md" onClick={onRetry} variant="light">
              Retry
            </Button>
          ) : null}
        </div>
      </Group>
    </Card>
  );
}

export function EmptyState({
  title = 'No data',
  description = 'There is no data to display yet.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card withBorder radius={8} p="lg">
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon color="gray" variant="light" radius="xl">
          <IconInbox size={18} />
        </ThemeIcon>
        <div>
          <Text fw={600}>{title}</Text>
          <Text c="dimmed" size="sm" mt={6}>{description}</Text>
        </div>
      </Group>
    </Card>
  );
}

export function formatApiValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'No data';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}
