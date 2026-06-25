import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  LinearProgress,
  styled
} from '@mui/material';
import {
  FavoriteBorder as PhysicalIcon,
  PsychologyAlt as MentalIcon,
  TrackChanges as PracticeIcon,
  CheckCircleOutline as CheckIcon,
  PlayArrowRounded as PlayIcon,
  PauseRounded as PauseIcon,
  StopRounded as StopIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

const BreathingOrb = styled(motion.div)(({ theme }) => ({
  width: 220,
  height: 220,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  textAlign: 'center',
  margin: '0 auto',
  fontFamily: "'Urbanist', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.01em',
  border: '2px solid rgba(124,111,224,0.26)',
  backgroundColor: '#7C6FE0',
  boxShadow: '0 16px 38px rgba(124,111,224,0.28)'
}));

const patternOptions = [
  { value: '4-4-4-4', label: 'Box Breathing (4-4-4-4)' },
  { value: '4-7-8', label: 'Relaxing Breath (4-7-8)' },
  { value: '5-2-5', label: 'Calming Breath (5-2-5)' },
  { value: '6-3-6-3', label: 'Square Breathing (6-3-6-3)' },
  { value: 'custom', label: 'Custom Pattern' }
];

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
};

const buildPhases = (pattern, inhale, hold1, exhale, hold2) => {
  let values;

  if (pattern === 'custom') {
    values = [inhale, hold1, exhale, hold2];
  } else {
    const parsed = pattern.split('-').map((item) => Number(item));
    values = parsed.length === 3 ? [parsed[0], parsed[1], parsed[2], 0] : parsed;
  }

  const [inSec, holdOneSec, exSec, holdTwoSec] = values.map((item, index) => {
    const min = index === 1 || index === 3 ? 0 : 1;
    return clampNumber(item, min, 12, index === 1 || index === 3 ? 0 : 4);
  });

  const phases = [
    { key: 'inhale', label: 'Breathe In', duration: inSec },
    ...(holdOneSec > 0 ? [{ key: 'hold', label: 'Hold', duration: holdOneSec }] : []),
    { key: 'exhale', label: 'Breathe Out', duration: exSec },
    ...(holdTwoSec > 0 ? [{ key: 'hold', label: 'Hold', duration: holdTwoSec }] : [])
  ];

  return phases;
};

const phaseAnimation = (phase, duration) => {
  if (phase === 'inhale') {
    return {
      scale: 1.26,
      backgroundColor: '#7C6FE0',
      color: '#FFFFFF',
      boxShadow: '0 20px 46px rgba(124,111,224,0.35)',
      transition: { duration, ease: 'easeInOut' }
    };
  }

  if (phase === 'hold') {
    return {
      scale: 1.26,
      backgroundColor: '#5A4ABF',
      color: '#FFFFFF',
      boxShadow: '0 18px 40px rgba(90,74,191,0.34)',
      transition: { duration, ease: 'easeInOut' }
    };
  }

  if (phase === 'exhale') {
    return {
      scale: 0.9,
      backgroundColor: '#87D3F8',
      color: '#1A1A2E',
      boxShadow: '0 14px 30px rgba(135,211,248,0.30)',
      transition: { duration, ease: 'easeInOut' }
    };
  }

  return {
    scale: 1,
    backgroundColor: '#7C6FE0',
    color: '#FFFFFF',
    boxShadow: '0 16px 36px rgba(124,111,224,0.28)',
    transition: { duration: 0.5, ease: 'easeInOut' }
  };
};

const BreathingExercise = () => {
  const benefits = [
    {
      title: 'Physical Benefits',
      icon: <PhysicalIcon />,
      color: 'rgba(135,211,248,0.20)',
      items: [
        'Reduces blood pressure',
        'Improves immune function',
        'Increases energy levels',
        'Relaxes muscles and reduces tension',
        'Improves sleep quality'
      ]
    },
    {
      title: 'Mental Benefits',
      icon: <MentalIcon />,
      color: 'rgba(124,111,224,0.14)',
      items: [
        'Reduces stress and anxiety',
        'Improves focus and concentration',
        'Enhances emotional regulation',
        'Promotes mindfulness',
        'Creates mental clarity'
      ]
    },
    {
      title: 'Best Practices',
      icon: <PracticeIcon />,
      color: 'rgba(124,111,224,0.10)',
      items: [
        'Find a quiet, comfortable space',
        'Practice at the same time daily',
        'Start with shorter sessions',
        'Breathe through your nose when possible',
        'Focus on the sensations of breathing'
      ]
    }
  ];

  const [breathingPattern, setBreathingPattern] = useState('4-4-4-4');
  const [customInhale, setCustomInhale] = useState(4);
  const [customHold1, setCustomHold1] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);
  const [customHold2, setCustomHold2] = useState(4);
  const [exerciseDuration, setExerciseDuration] = useState(3);

  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);

  const tickerRef = useRef(null);
  const phaseIndexRef = useRef(0);

  const showCustomInputs = breathingPattern === 'custom';

  const phases = useMemo(
    () => buildPhases(breathingPattern, customInhale, customHold1, customExhale, customHold2),
    [breathingPattern, customInhale, customHold1, customExhale, customHold2]
  );

  const cycleDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  const totalSessionSeconds = exerciseDuration * 60;
  const currentPhase = isExerciseRunning
    ? phases[currentPhaseIndex] || { key: 'ready', label: 'Prepare', duration: 1 }
    : { key: 'ready', label: 'Ready', duration: 1 };

  const estimatedCycles = cycleDuration > 0 ? Math.floor(totalSessionSeconds / cycleDuration) : 0;
  const sessionProgress = totalSessionSeconds > 0
    ? ((totalSessionSeconds - remainingTime) / totalSessionSeconds) * 100
    : 0;
  const phaseProgress = currentPhase.duration > 0
    ? ((currentPhase.duration - phaseSecondsLeft) / currentPhase.duration) * 100
    : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stopExercise = () => {
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = null;
    phaseIndexRef.current = 0;
    setIsExerciseRunning(false);
    setIsPaused(false);
    setRemainingTime(totalSessionSeconds);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(phases[0]?.duration || 1);
  };

  const startExercise = () => {
    if (!phases.length) return;
    if (tickerRef.current) clearInterval(tickerRef.current);

    phaseIndexRef.current = 0;
    setIsExerciseRunning(true);
    setIsPaused(false);
    setRemainingTime(totalSessionSeconds);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(phases[0].duration);
  };

  const togglePause = () => {
    if (!isExerciseRunning) return;
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!isExerciseRunning || isPaused) {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      return;
    }

    tickerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsExerciseRunning(false);
          setIsPaused(false);
          if (tickerRef.current) clearInterval(tickerRef.current);
          tickerRef.current = null;
          phaseIndexRef.current = 0;
          setCurrentPhaseIndex(0);
          setPhaseSecondsLeft(phases[0]?.duration || 1);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (phaseIndexRef.current + 1) % phases.length;
          phaseIndexRef.current = nextIndex;
          setCurrentPhaseIndex(nextIndex);
          return phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
      tickerRef.current = null;
    };
  }, [isExerciseRunning, isPaused, phases]);

  useEffect(() => () => {
    if (tickerRef.current) clearInterval(tickerRef.current);
  }, []);

  useEffect(() => {
    if (!isExerciseRunning) {
      setRemainingTime(totalSessionSeconds);
      setCurrentPhaseIndex(0);
      setPhaseSecondsLeft(phases[0]?.duration || 1);
      phaseIndexRef.current = 0;
    }
  }, [totalSessionSeconds, phases, isExerciseRunning]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Chip icon={<Wind size={16} />} label="Guided Calm" size="small" sx={{ mb: 1 }} />
      </Box>
      <Typography variant="h3" component="h1" align="center" gutterBottom className="zen-feature-title">
        Breathing Exercise
      </Typography>
      <Typography align="center" className="zen-feature-subtitle" sx={{ maxWidth: 760, mx: 'auto', mb: 4 }}>
        Structured breathing sessions with paced visuals. Set your rhythm, follow the animation, and settle your nervous system.
      </Typography>

      <Card
        className="zen-feature-card"
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(124,111,224,0.14)'
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Box sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, bgcolor: 'rgba(124,111,224,0.06)', border: '1px solid rgba(124,111,224,0.16)' }}>
                <Typography variant="h5" sx={{ mb: 1.5 }}>Session Setup</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  Choose a pattern and session length. The animation will follow your exact inhale/hold/exhale timings.
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Breathing Pattern</InputLabel>
                  <Select
                    value={breathingPattern}
                    onChange={(e) => setBreathingPattern(e.target.value)}
                    label="Breathing Pattern"
                    disabled={isExerciseRunning}
                  >
                    {patternOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {showCustomInputs && (
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <TextField
                        label="Inhale"
                        type="number"
                        value={customInhale}
                        onChange={(e) => setCustomInhale(clampNumber(e.target.value, 1, 12, 4))}
                        inputProps={{ min: 1, max: 12 }}
                        fullWidth
                        disabled={isExerciseRunning}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Hold"
                        type="number"
                        value={customHold1}
                        onChange={(e) => setCustomHold1(clampNumber(e.target.value, 0, 12, 4))}
                        inputProps={{ min: 0, max: 12 }}
                        fullWidth
                        disabled={isExerciseRunning}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Exhale"
                        type="number"
                        value={customExhale}
                        onChange={(e) => setCustomExhale(clampNumber(e.target.value, 1, 12, 4))}
                        inputProps={{ min: 1, max: 12 }}
                        fullWidth
                        disabled={isExerciseRunning}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Hold"
                        type="number"
                        value={customHold2}
                        onChange={(e) => setCustomHold2(clampNumber(e.target.value, 0, 12, 4))}
                        inputProps={{ min: 0, max: 12 }}
                        fullWidth
                        disabled={isExerciseRunning}
                      />
                    </Grid>
                  </Grid>
                )}

                <FormControl fullWidth sx={{ mb: 2.5 }}>
                  <InputLabel>Exercise Duration</InputLabel>
                  <Select
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(Number(e.target.value))}
                    label="Exercise Duration"
                    disabled={isExerciseRunning}
                  >
                    <MenuItem value={1}>1 minute</MenuItem>
                    <MenuItem value={2}>2 minutes</MenuItem>
                    <MenuItem value={3}>3 minutes</MenuItem>
                    <MenuItem value={5}>5 minutes</MenuItem>
                    <MenuItem value={10}>10 minutes</MenuItem>
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: 'wrap', rowGap: 1 }}>
                  <Chip label={`Cycle: ${cycleDuration}s`} />
                  <Chip label={`Est. cycles: ${estimatedCycles}`} />
                  <Chip label={`Session: ${exerciseDuration} min`} />
                </Stack>

                {!isExerciseRunning ? (
                  <Button fullWidth size="large" variant="contained" startIcon={<PlayIcon />} onClick={startExercise}>
                    Start Session
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1.5}>
                    <Button fullWidth size="large" variant="contained" color="secondary" startIcon={<PauseIcon />} onClick={togglePause}>
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button fullWidth size="large" variant="outlined" color="error" startIcon={<StopIcon />} onClick={stopExercise}>
                      Stop
                    </Button>
                  </Stack>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  background: 'rgba(248,247,255,0.88)',
                  border: '1px solid rgba(124,111,224,0.16)',
                  minHeight: 430
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="h6">Live Breathing Guide</Typography>
                  <Chip label={isExerciseRunning ? (isPaused ? 'Paused' : 'In Progress') : 'Not Started'} color={isExerciseRunning ? 'primary' : 'default'} />
                </Box>

                <Typography variant="h3" sx={{ fontFamily: "'Urbanist', sans-serif", mb: 0.5 }}>
                  {formatTime(remainingTime)}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {isExerciseRunning ? currentPhase.label : 'Press Start Session to begin guided breathing'}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, sessionProgress))}
                  sx={{ height: 8, borderRadius: 999, mb: 3 }}
                />

                <Box sx={{ position: 'relative', width: 280, height: 280, mx: 'auto', mb: 3 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: `conic-gradient(rgba(124,111,224,0.72) ${Math.max(0, Math.min(100, phaseProgress))}%, rgba(124,111,224,0.12) 0)`,
                      p: '10px'
                    }}
                  >
                    <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.52)' }} />
                  </Box>

                  <Box sx={{ position: 'absolute', inset: 30, display: 'grid', placeItems: 'center' }}>
                    <BreathingOrb animate={phaseAnimation(currentPhase.key, currentPhase.duration)}>
                      <Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, mb: 0.5 }}>{currentPhase.label}</Typography>
                        <Typography sx={{ fontSize: '0.95rem', opacity: 0.9 }}>
                          {isExerciseRunning ? `${phaseSecondsLeft}s` : 'Ready'}
                        </Typography>
                      </Box>
                    </BreathingOrb>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                  {phases.map((phase, index) => (
                    <Chip
                      key={`${phase.key}-${index}`}
                      label={`${phase.label} ${phase.duration}s`}
                      color={index === currentPhaseIndex && isExerciseRunning ? 'primary' : 'default'}
                      variant={index === currentPhaseIndex && isExerciseRunning ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        className="zen-feature-card"
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(124,111,224,0.12)'
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" className="zen-feature-title" sx={{ mb: 1 }}>
              Benefits of Breathing Exercises
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Build calm, clarity, and consistency with a few minutes of guided breathing each day.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {benefits.map((section) => (
              <Grid item xs={12} md={4} key={section.title}>
                <Box
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    p: 2.5,
                    background: section.color,
                    border: '1px solid rgba(124,111,224,0.16)',
                    boxShadow: '0 8px 24px rgba(124,111,224,0.10)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.75)',
                        color: 'primary.main'
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6">{section.title}</Typography>
                  </Box>

                  <List sx={{ p: 0 }}>
                    {section.items.map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 0.75, alignItems: 'flex-start' }}>
                        <CheckIcon fontSize="small" sx={{ mt: '3px', mr: 1, color: 'primary.main' }} />
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { lineHeight: 1.55, color: 'text.primary' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BreathingExercise;
