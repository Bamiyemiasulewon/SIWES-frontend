import { SimpleGrid, Paper, Text, Title, Card } from '@mantine/core';
import { BarChart, DonutChart, LineChart } from '@mantine/charts';

export default function DashboardPage() {
  const chartData = [
    { name: 'Submitted', value: 12 },
    { name: 'Assigned', value: 8 },
    { name: 'In progress', value: 6 },
    { name: 'Resolved', value: 14 },
    { name: 'Reopened', value: 3 },
    { name: 'Closed', value: 21 },
  ];

  return (
    <>
      <Text size="22px" fw={600}>Dashboard</Text>
      <SimpleGrid cols={5} mt="lg">
        {['Total requests', 'Open', 'Resolved', 'Reopened', 'Flagged'].map((label, index) => (
          <Card key={label} withBorder radius={6} p="md">
            <Text c="dimmed" size="xs" tt="uppercase" style={{ letterSpacing: '0.08em' }}>{label}</Text>
            <Title order={3} mt="xs">{[64, 19, 22, 7, 3][index]}</Title>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={2} mt="xl">
        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests by status</Text>
          <BarChart h={250} data={chartData} dataKey="name" series={[{ name: 'value', color: '#0F5C4D' }]} />
        </Paper>
        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests by type</Text>
          <DonutChart h={250} data={[{ name: 'Maintenance', value: 18, color: '#0F5C4D' }, { name: 'Complaint', value: 26, color: '#6B6B63' }]} />
        </Paper>
        <Paper withBorder p="md" radius={6}>
          <Text fw={600} mb="sm">Requests per day</Text>
          <LineChart h={250} data={[{ date: 'Mon', value: 2 }, { date: 'Tue', value: 4 }, { date: 'Wed', value: 3 }, { date: 'Thu', value: 6 }, { date: 'Fri', value: 5 }, { date: 'Sat', value: 7 }, { date: 'Sun', value: 4 }]} dataKey="date" series={[{ name: 'value', color: '#0F5C4D' }]} />
        </Paper>
      </SimpleGrid>
    </>
  );
}
