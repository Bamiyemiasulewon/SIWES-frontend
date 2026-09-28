import { AppShell, Box, Burger, Button, Group, NavLink, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconLogout, IconReceipt, IconShield, IconStack2, IconUsers, IconBuildingStore, IconLayoutDashboard, IconChecklist, IconFlag, IconId } from '@tabler/icons-react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

const navGroups = [
  { label: 'Overview', items: [{ label: 'Dashboard', to: '/dashboard', icon: IconLayoutDashboard }] },
  { label: 'Requests', items: [{ label: 'My requests', to: '/requests', icon: IconReceipt }, { label: 'Queue', to: '/queue', icon: IconChecklist }] },
  { label: 'Admin', items: [{ label: 'Users', to: '/users', icon: IconUsers }, { label: 'Departments', to: '/departments', icon: IconBuildingStore }, { label: 'Assets', to: '/assets', icon: IconStack2 }, { label: 'Flagged', to: '/flagged', icon: IconFlag }, { label: 'Identity reveals', to: '/identity-reveals', icon: IconId }] },
];

export default function AppShellLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [opened, { toggle, close }] = useDisclosure(false);
  const desktop = useMediaQuery('(min-width: 900px)');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const visibleNav = navGroups.filter((group) => {
    if (group.label === 'Admin') {
      return user.role === 'admin';
    }
    if (group.label === 'Requests') {
      return user.role === 'student' || user.role === 'staff' || user.role === 'maintenance_officer' || user.role === 'complaint_officer' || user.role === 'admin';
    }
    return true;
  });

  const renderNav = (
    <Box w={232} bg="white" style={{ borderRight: '1px solid #E4E4DF' }}>
      <Box p="lg" pt="md" pb="sm">
        <Text fw={600} size="lg">Campus ServiceDesk</Text>
        <Text c="dimmed" size="xs" mt={4}>School of Computing</Text>
      </Box>

      {visibleNav.map((group) => (
        <Box key={group.label} px="sm" pt="xs">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} px="xs" mb={6} style={{ letterSpacing: '0.08em' }}>
            {group.label}
          </Text>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                active={isActive}
                label={item.label}
                leftSection={<Icon size={16} stroke={1.5} />}
                onClick={() => {
                  navigate(item.to);
                  close();
                }}
                style={{
                  borderLeft: isActive ? '2px solid #0F5C4D' : '2px solid transparent',
                  borderRadius: 0,
                  marginLeft: isActive ? 0 : 2,
                  background: isActive ? '#F7F7F5' : 'transparent',
                }}
                variant="subtle"
              />
            );
          })}
        </Box>
      ))}

      <Box mt="auto" p="md" style={{ borderTop: '1px solid #E4E4DF' }}>
        <Text fw={600}>{user.name}</Text>
        <Text size="xs" c="dimmed" tt="capitalize">{user.role.replace('_', ' ')}</Text>
        <Button leftSection={<IconLogout size={16} stroke={1.5} />} variant="subtle" mt="md" onClick={logout} fullWidth>
          Sign out
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{ width: 232, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: false } }}
      padding="md"
    >
      <AppShell.Header bg="white" style={{ borderBottom: '1px solid #E4E4DF' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            {!desktop && (
              <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" size="sm" />
            )}
            <Text c="dimmed" size="sm">Campus ServiceDesk</Text>
          </Group>
          <Group>
            <Button variant="subtle" aria-label="User menu" leftSection={<IconShield size={16} stroke={1.5} />}>
              {user.name}
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      {desktop && <AppShell.Navbar>{renderNav}</AppShell.Navbar>}
      {!desktop && opened && <AppShell.Navbar>{renderNav}</AppShell.Navbar>}

      <AppShell.Main bg="#F7F7F5">
        <Box maw={1200} mx="auto" px={32} py="xl">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
