import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Link
} from '@mui/material';
import {
  Send as SendIcon,
  DeleteOutline as DeleteIcon,
  Psychology as BotIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageCircleHeart } from 'lucide-react';

const suggestedQuestions = [
  'How can I manage anxiety?',
  'Tips for better sleep?',
  'How to calm down quickly?',
  'How can I improve focus?',
  'How to handle overthinking?',
  'What are healthy coping mechanisms?'
];

const getWelcomeMessage = (name) => ({
  _id: `welcome-${Date.now()}`,
  message: `Hi ${name || 'there'}, I am here to listen and help. What would you like to talk about today?`,
  isUser: false,
  createdAt: new Date().toISOString()
});

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (active) setMessages([getWelcomeMessage(user?.name)]);
          return;
        }

        const res = await axios.get('/api/chatbot/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!active) return;
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setMessages(res.data.data);
        } else {
          setMessages([getWelcomeMessage(user?.name)]);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        if (active) setMessages([getWelcomeMessage(user?.name)]);
      }
    };

    fetchMessages();
    return () => { active = false; };
  }, [user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const renderMessageWithLinks = (message) => {
    return message.split('\n').map((line, lineIndex, lines) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let lastIndex = 0;
      const elements = [];
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          elements.push(line.substring(lastIndex, match.index));
        }
        elements.push(
          <Link key={`link-${lineIndex}-${match.index}`} href={match[2]} color="primary" sx={{ textDecoration: 'underline' }}>
            {match[1]}
          </Link>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) elements.push(line.substring(lastIndex));
      if (elements.length === 0) elements.push(line);

      return (
        <React.Fragment key={`line-${lineIndex}`}>
          {elements}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const sendMessage = async (e, explicitMessage) => {
    e?.preventDefault();
    const text = (explicitMessage ?? input).trim();
    if (!text || loading) return;

    if (!explicitMessage) setInput('');

    const optimistic = {
      _id: `temp-${Date.now()}`,
      message: text,
      isUser: true,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimistic]);
    setTyping(true);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/chatbot/message',
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages((prev) => [
          ...prev.filter((item) => item._id !== optimistic._id),
          res.data.data.userMessage,
          res.data.data.botMessage
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            _id: `error-${Date.now()}`,
            message: 'Something went wrong. Please try again.',
            isUser: false,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          _id: `error-${Date.now()}`,
          message: "I'm having trouble connecting right now. Please try again in a moment.",
          isUser: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setTyping(false);
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/chatbot/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([getWelcomeMessage(user?.name)]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Card
        className="zen-feature-card"
        elevation={2}
        sx={{
          mb: 2.5,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Chip icon={<MessageCircleHeart size={16} />} size="small" label="Conversation Studio" sx={{ mb: 1 }} />
          <Typography variant="h4" className="zen-feature-title" sx={{ mb: 0.6 }}>
            Mental Health Chat
          </Typography>
          <Typography className="zen-feature-subtitle">
            A calm space to ask questions, process thoughts, and get practical support.
          </Typography>
        </CardContent>
      </Card>

      <Card
        className="zen-feature-card"
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          minHeight: 560,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'text.primary',
            background: 'rgba(124,111,224,0.10)',
            borderBottom: '1px solid rgba(124,111,224,0.16)'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Zen Assistant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                {typing ? 'Typing...' : 'Online'}
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Clear chat">
            <IconButton color="inherit" onClick={clearChat} disabled={loading}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            p: 1.25,
            borderBottom: '1px solid rgba(124,111,224,0.14)',
            background: 'rgba(248,247,255,0.78)',
            display: 'flex',
            gap: 1,
            overflowX: 'auto'
          }}
        >
          {suggestedQuestions.map((question) => (
            <Chip
              key={question}
              label={question}
              onClick={() => sendMessage(null, question)}
              clickable
              variant="outlined"
              sx={{ flexShrink: 0, '&:hover': { bgcolor: 'var(--zen-primary-10)' } }}
            />
          ))}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
            background: 'rgba(248,247,255,0.82)'
          }}
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: msg.isUser ? 'primary.main' : 'rgba(255,255,255,0.94)',
                    color: msg.isUser ? 'white' : 'text.primary',
                    border: msg.isUser ? 'none' : '1px solid rgba(124,111,224,0.14)'
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.58 }}>
                    {renderMessageWithLinks(msg.message)}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.8, textAlign: 'right', opacity: 0.7 }}>
                    {formatTime(msg.createdAt)}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <Paper
              elevation={0}
              sx={{
                p: 1.2,
                borderRadius: 3,
                border: '1px solid rgba(124,111,224,0.14)',
                bgcolor: 'rgba(255,255,255,0.92)',
                width: 86
              }}
            >
              <Stack direction="row" spacing={0.7} justifyContent="center">
                {[0, 0.15, 0.3].map((delay) => (
                  <Box
                    key={delay}
                    component={motion.div}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                    sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main' }}
                  />
                ))}
              </Stack>
            </Paper>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />
        <Box component="form" onSubmit={sendMessage} sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!input.trim() || loading}
            sx={{ minWidth: 110, py: 1.45 }}
          >
            Send
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Chatbot;
