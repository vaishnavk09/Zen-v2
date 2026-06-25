import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Chip, Alert, CircularProgress, Stack
} from '@mui/material';
import { Mail, Send, MessageCircle } from 'lucide-react';
import axios from 'axios';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 6, px: 2 }}>
      {/* Header */}
      <Card className="zen-feature-card" elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Chip icon={<MessageCircle size={16} />} size="small" label="Get In Touch" sx={{ mb: 1 }} />
          <Typography variant="h4" className="zen-feature-title" sx={{ mb: 0.6 }}>
            Contact Us
          </Typography>
          <Typography className="zen-feature-subtitle">
            Have a question or feedback? We'd love to hear from you. Our team will get back to you within 24 hours.
          </Typography>
        </CardContent>
      </Card>

      {/* Form */}
      <Card className="zen-feature-card" elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>🎉</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Message Sent!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Thank you for reaching out. We'll get back to you within 24 hours.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSuccess(false)}
              >
                Send Another Message
              </Button>
            </Box>
          ) : (
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                placeholder="Enter your name"
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                placeholder="Enter your email"
              />

              <TextField
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={5}
                disabled={loading}
                placeholder="Write your message here..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !form.name || !form.email || !form.message}
                endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send size={18} />}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>

              <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                <Mail size={16} />
                <Typography variant="caption" color="text.secondary">
                  We typically respond within 24 hours
                </Typography>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactPage;