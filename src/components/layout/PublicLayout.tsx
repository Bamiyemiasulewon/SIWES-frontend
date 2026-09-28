import { Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <Box bg="#F7F7F5" mih="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <Outlet />
    </Box>
  );
}
