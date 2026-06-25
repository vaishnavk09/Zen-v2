import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import JournalForm from './components/JournalForm';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import MoodTracker from './pages/MoodTracker';
import Chatbot from './pages/Chatbot';
import BreathingExercise from './pages/BreathingExercise';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContent = () => {

  const { darkMode } = useTheme();

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#7C6FE0',
          light: '#9B91E8',
          dark: '#5A4ABF',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#87D3F8',
          light: '#C3E9FB',
          dark: '#4ABCF4',
          contrastText: '#1A1A2E',
        },
        background: {
          default: darkMode ? '#171426' : '#F8F7FF',
          paper:   darkMode ? '#221D35' : '#FFFFFF',
        },
        text: {
          primary:   darkMode ? '#F0EFFE' : '#1A1A2E',
          secondary: darkMode ? '#9B91E8' : '#64607A',
        },
      },
      typography: {
        fontFamily: "'Urbanist', 'Lato', sans-serif",
        fontWeightLight:   300,
        fontWeightRegular: 400,
        fontWeightMedium:  600,
        fontWeightBold:    700,
        h1: { fontFamily: "'Urbanist', sans-serif", fontWeight: 800 },
        h2: { fontFamily: "'Urbanist', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Urbanist', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Urbanist', sans-serif", fontWeight: 600 },
        h5: { fontFamily: "'Urbanist', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Urbanist', sans-serif", fontWeight: 600 },
        body1: { fontFamily: "'Lato', sans-serif", fontWeight: 400 },
        body2: { fontFamily: "'Lato', sans-serif", fontWeight: 400 },
      },
      shape: { borderRadius: 16 },
      shadows: [
        'none',
        '0 2px 12px rgba(124, 111, 224, 0.08)',
        '0 4px 18px rgba(124, 111, 224, 0.10)',
        '0 8px 26px rgba(124, 111, 224, 0.12)',
        '0 12px 32px rgba(124, 111, 224, 0.14)',
        '0 16px 38px rgba(124, 111, 224, 0.16)',
        '0 20px 44px rgba(124, 111, 224, 0.18)',
        '0 22px 48px rgba(124, 111, 224, 0.20)',
        '0 24px 52px rgba(124, 111, 224, 0.22)',
        '0 26px 56px rgba(124, 111, 224, 0.24)',
        '0 28px 60px rgba(124, 111, 224, 0.26)',
        '0 30px 64px rgba(124, 111, 224, 0.28)',
        '0 32px 68px rgba(124, 111, 224, 0.30)',
        '0 34px 72px rgba(124, 111, 224, 0.32)',
        '0 36px 76px rgba(124, 111, 224, 0.34)',
        '0 38px 80px rgba(124, 111, 224, 0.36)',
        '0 40px 84px rgba(124, 111, 224, 0.38)',
        '0 42px 88px rgba(124, 111, 224, 0.40)',
        '0 44px 92px rgba(124, 111, 224, 0.42)',
        '0 46px 96px rgba(124, 111, 224, 0.44)',
        '0 48px 100px rgba(124, 111, 224, 0.46)',
        '0 50px 104px rgba(124, 111, 224, 0.48)',
        '0 52px 108px rgba(124, 111, 224, 0.50)',
        '0 54px 112px rgba(124, 111, 224, 0.52)',
        '0 56px 116px rgba(124, 111, 224, 0.54)',
      ],
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background: darkMode ? '#171426' : '#F8F7FF',
              minHeight: '100vh',
            },
            '#root': {
              minHeight: '100vh',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: darkMode ? 'rgba(26, 21, 45, 0.80)' : 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              color: darkMode ? '#F0EFFE' : '#1A1A2E',
              borderBottom: darkMode
                ? '1px solid rgba(155, 145, 232, 0.20)'
                : '1px solid rgba(124, 111, 224, 0.16)',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              background: darkMode ? 'rgba(24, 20, 40, 0.85)' : 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRight: darkMode
                ? '1px solid rgba(155, 145, 232, 0.20)'
                : '1px solid rgba(124, 111, 224, 0.16)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              background: darkMode ? '#221D35' : '#FFFFFF',
              border: darkMode
                ? '1px solid rgba(155, 145, 232, 0.18)'
                : '1px solid rgba(124, 111, 224, 0.10)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              background: darkMode ? '#221D35' : '#FFFFFF',
              border: darkMode
                ? '1px solid rgba(155, 145, 232, 0.18)'
                : '1px solid rgba(124, 111, 224, 0.10)',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 14,
              textTransform: 'none',
              fontWeight: 700,
              letterSpacing: '0.01em',
              paddingInline: '1rem',
              transition: 'all 0.2s ease',
              '&.Mui-disabled': {
                background: darkMode ? 'rgba(155, 145, 232, 0.18)' : 'rgba(124, 111, 224, 0.16)',
                color: darkMode ? 'rgba(240, 239, 255, 0.55)' : 'rgba(26, 26, 46, 0.45)',
              },
            },
            containedPrimary: {
              backgroundImage: 'none',
              backgroundColor: '#7C6FE0',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(124, 111, 224, 0.26)',
              '&:hover': {
                backgroundColor: '#5A4ABF',
                boxShadow: '0 10px 24px rgba(124, 111, 224, 0.34)',
              },
            },
            containedSecondary: {
              backgroundImage: 'none',
              backgroundColor: '#87D3F8',
              color: '#1A1A2E',
              boxShadow: '0 8px 20px rgba(135, 211, 248, 0.30)',
              '&:hover': {
                backgroundColor: '#4ABCF4',
                boxShadow: '0 10px 24px rgba(135, 211, 248, 0.36)',
              },
            },
            outlined: {
              borderWidth: '1px',
              borderColor: darkMode ? 'rgba(155, 145, 232, 0.45)' : 'rgba(124, 111, 224, 0.42)',
              color: darkMode ? '#D9D4FF' : '#5A4ABF',
              backgroundColor: darkMode ? 'rgba(22, 18, 36, 0.24)' : 'rgba(255, 255, 255, 0.55)',
              '&:hover': {
                borderWidth: '1px',
                borderColor: darkMode ? 'rgba(155, 145, 232, 0.70)' : 'rgba(124, 111, 224, 0.70)',
                backgroundColor: darkMode ? 'rgba(155, 145, 232, 0.14)' : 'rgba(124, 111, 224, 0.10)',
              },
            },
            text: {
              color: darkMode ? '#D9D4FF' : '#5A4ABF',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(155, 145, 232, 0.16)' : 'rgba(124, 111, 224, 0.10)',
              },
            },
            sizeLarge: {
              paddingInline: '1.35rem',
              paddingBlock: '0.7rem',
            },
            sizeSmall: {
              borderRadius: 12,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 999,
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 14,
              background: darkMode ? 'rgba(18, 16, 31, 0.48)' : 'rgba(255, 255, 255, 0.66)',
              '& fieldset': {
                borderColor: darkMode ? 'rgba(155, 145, 232, 0.28)' : 'rgba(124, 111, 224, 0.24)',
              },
            },
          },
        },
      },
    }),
    [darkMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      <Router>

        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Navigate to="/journal" replace />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:id" element={<JournalDetail />} />
              <Route path="/journal/new" element={<JournalForm isEditing={false} />} />
              <Route path="/journal/edit/:id" element={<JournalForm isEditing={true} />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/breathing" element={<BreathingExercise />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* fallback */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>

        </Routes>

      </Router>

    </MuiThemeProvider>
  );
};

export default App;
