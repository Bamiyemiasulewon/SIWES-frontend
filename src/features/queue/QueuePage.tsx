import { Badge, Button, Card, Group, Tabs, Table, Text } from '@mantine/core';

export default function QueuePage() {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="lg">
        <div>
          <Text size="22px" fw={600}>Queue</Text>
          <Text c="dimmed" mt={6}>Review and act on outstanding requests.</Text>
        </div>
      </Group>

      <Tabs defaultValue="unassigned">
        <Tabs.List>
          <Tabs.Tab value="unassigned">Unassigned</Tabs.Tab>
          <Tabs.Tab value="assigned">Assigned to me</Tabs.Tab>
          <Tabs.Tab value="all">All in scope</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="unassigned" pt="md">
          <Card withBorder radius={6} p="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Reference</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>#102</Table.Td>
                  <Table.Td>Power issue in lab</Table.Td>
                  <Table.Td>Software Engineering</Table.Td>
                  <Table.Td><Badge>submitted</Badge></Table.Td>
                  <Table.Td><Button size="xs">Claim</Button></Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
