import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import Navigation from '../../components/Navigation';
import Theme from '../../components/Theme';

export default function Base({ children }) {
  const drawerWidth = '33ch';

  return (
    <Theme>
      <Navigation drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ paddingLeft: drawerWidth }}>{children}</Box>
    </Theme>
  );
}
