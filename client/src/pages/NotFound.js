import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper
} from '@mui/material';
import { 
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md">
      <Box
        className="zen-page-shell"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <div className="zen-page-dotgrid" />
        <div className="zen-page-blob zen-page-blob--one" />
        <div className="zen-page-blob zen-page-blob--two" />
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            width: '100%',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
          >
            <SadIcon 
              sx={{ 
                fontSize: 120, 
                color: darkMode ? 'rgba(155, 145, 232, 0.75)' : 'rgba(124, 111, 224, 0.72)',
                mb: 2
              }} 
            />
          </motion.div>
          
          <Typography 
            variant="h1" 
            component={motion.h1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '4rem', md: '6rem' },
              color: darkMode ? '#9B91E8' : '#5A4ABF',
              mb: 2
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            component={motion.h4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            gutterBottom
            className="zen-page-title"
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            sx={{ mb: 4, maxWidth: 500 }}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to a place of mindfulness.
          </Typography>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ borderRadius: 8, px: 4, py: 1.5 }}
            >
              Back to Home
            </Button>
          </motion.div>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 
