import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Favorite as HeartIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { NotebookPen } from 'lucide-react';

const Journal = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/journal', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setJournalEntries(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    journalEntries.forEach((entry) => {
      if (Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [journalEntries]);

  const filteredEntries = useMemo(() => {
    let filtered = [...journalEntries];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter((entry) =>
        (entry.title && entry.title.toLowerCase().includes(query)) ||
        (entry.content && entry.content.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (entry) => Array.isArray(entry.tags) && selectedTags.every((tag) => entry.tags.includes(tag))
      );
    }

    if (sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [journalEntries, searchTerm, selectedTags, sortOption]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortOption('newest');
  };

  const deleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`/api/journal/${entryToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setJournalEntries((prev) => prev.filter((entry) => entry._id !== entryToDelete._id));
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const truncateText = (text, maxLength = 230) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getMoodEmoji = (value) => {
    if (!value) return null;
    if (value >= 8) return '😄';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '😔';
    return '😢';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 1 }}>
      <Card
        className="zen-feature-card"
        elevation={2}
        sx={{
          mb: 2.5,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.4}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Chip icon={<NotebookPen size={16} />} label="Quiet Reflection" size="small" sx={{ mb: 1 }} />
              <Typography variant="h4" className="zen-feature-title" sx={{ mb: 0.6 }}>
                Your Journal Space
              </Typography>
              <Typography className="zen-feature-subtitle">
                Capture thoughts gently, revisit what matters, and notice your emotional patterns over time.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/journal/new')}
              sx={{ px: 2.8, py: 1.1 }}
            >
              New Entry
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card className="zen-feature-card" elevation={2} sx={{ borderRadius: 3, position: { md: 'sticky' }, top: { md: 108 } }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.4 }}>
                Find Entries
              </Typography>

              <TextField
                fullWidth
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 1.4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                select
                fullWidth
                size="small"
                label="Sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                sx={{ mb: 1.8 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value="newest">Newest first</MenuItem>
                <MenuItem value="oldest">Oldest first</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
              </TextField>

              <Typography variant="subtitle2" sx={{ mb: 0.8 }}>
                Filter by tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.6 }}>
                {allTags.length > 0 ? (
                  allTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => toggleTag(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags yet
                  </Typography>
                )}
              </Box>

              <Button onClick={clearFilters} variant="text" size="small">
                Clear filters
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 0.4 }}>
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
            </Typography>

            <AnimatePresence>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <Card
                    className="zen-feature-card"
                    key={entry._id}
                    elevation={2}
                    component={motion.div}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                      borderRadius: 3,
                      cursor: 'pointer',
                      border: '1px solid rgba(124,111,224,0.12)',
                      '&:hover': {
                        boxShadow: '0 10px 28px rgba(124,111,224,0.16)'
                      }
                    }}
                    onClick={() => navigate(`/journal/${entry._id}`)}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 2.4 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.2}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" sx={{ mb: 0.7 }}>
                            {entry.title || format(parseISO(entry.createdAt), 'MMMM d, yyyy')}
                          </Typography>

                          <Stack direction="row" spacing={1.5} sx={{ mb: 1.1 }} alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                              <CalendarIcon fontSize="inherit" />
                              {format(parseISO(entry.createdAt), 'MMM d, yyyy')}
                            </Typography>
                            {entry.mood && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <HeartIcon fontSize="inherit" />
                                Mood {entry.mood}/10 {getMoodEmoji(entry.mood)}
                              </Typography>
                            )}
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={0.3}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/journal/edit/${entry._id}`);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEntryToDelete(entry);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Typography variant="body2" sx={{ lineHeight: 1.65, mb: 1.3 }}>
                        {truncateText(entry.content)}
                      </Typography>

                      {Array.isArray(entry.tags) && entry.tags.length > 0 && (
                        <>
                          <Divider sx={{ mb: 1.2 }} />
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                            {entry.tags.map((tag, index) => (
                              <Chip
                                key={`${tag}-${index}`}
                                size="small"
                                icon={<TagIcon fontSize="small" />}
                                label={tag}
                                sx={{
                                  bgcolor: darkMode ? 'rgba(138,121,240,0.12)' : 'rgba(124,111,224,0.10)',
                                  color: darkMode ? '#b8afff' : '#5A4ABF'
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Paper
                  className="zen-feature-card-soft"
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    border: '1px dashed rgba(124,111,224,0.30)',
                    bgcolor: 'rgba(255,255,255,0.55)'
                  }}
                >
                  {journalEntries.length === 0 ? (
                    <>
                      <Typography variant="h6" sx={{ mb: 0.8 }}>
                        Your journal is empty
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start with one small note. It does not have to be perfect.
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/journal/new')}>
                        Write your first entry
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ mb: 0.8 }}>
                        No entries match your filters
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Try a different keyword, tag, or sorting option.
                      </Typography>
                      <Button variant="outlined" onClick={clearFilters}>
                        Reset filters
                      </Button>
                    </>
                  )}
                </Paper>
              )}
            </AnimatePresence>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Journal Entry</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this entry? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteEntry} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Journal;
