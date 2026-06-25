import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LandingNavbar from './landing/LandingNavbar';
import LandingFooter from './landing/LandingFooter';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingNavbar />

      <Box
        sx={{
          flex: 1,
          pt: isLanding ? 0 : { xs: '104px', md: '116px' },
          px: { xs: 2, md: 4 },
          pb: isLanding ? 0 : 5,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}>
        {isLanding ? (
          <Outlet />
        ) : (
          <Box
            sx={{
              borderRadius: 4,
              px: { xs: 0.5, md: 1.5 },
              py: { xs: 1.5, md: 2.5 },
              mb: 2,
            }}
          >
            <Outlet />
          </Box>
        )}
        </Box>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default Layout;
