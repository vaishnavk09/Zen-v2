import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { MessageCircleHeart, NotebookPen, Activity, Wind } from "lucide-react";
import "./FeaturesSection.css";

const features = [
  {
    icon: <MessageCircleHeart size={26} />,
    title: "AI Chatbot",
    text: "Talk to our AI mental health companion — anytime, judgment-free.",
    link: "/chatbot",
    color: "#7C6FE0",
    bg: "rgba(124,111,224,0.08)",
    accent: "rgba(124,111,224,0.18)",
  },
  {
    icon: <NotebookPen size={26} />,
    title: "Journal",
    text: "Record your thoughts and feelings in your private space.",
    link: "/journal",
    color: "#87D3F8",
    bg: "rgba(135,211,248,0.10)",
    accent: "rgba(135,211,248,0.22)",
  },
  {
    icon: <Activity size={26} />,
    title: "Mood Tracker",
    text: "Track and visualize your emotional patterns over time.",
    link: "/mood",
    color: "#9B91E8",
    bg: "rgba(155,145,232,0.08)",
    accent: "rgba(155,145,232,0.18)",
  },
  {
    icon: <Wind size={26} />,
    title: "Breathing Exercise",
    text: "Practice guided breathing exercises to reduce stress.",
    link: "/breathing",
    color: "#4ABCF4",
    bg: "rgba(74,188,244,0.08)",
    accent: "rgba(74,188,244,0.18)",
  },
];

const FeatureCard = ({ icon, title, text, link, color, bg, accent }) => (
  <div className="feature-card-zen">
    <div className="feature-card-zen__icon" style={{ background: bg, color }}>
      {icon}
    </div>
    <Typography
      variant="h6"
      sx={{
        fontFamily: "'Urbanist', sans-serif",
        fontWeight: 700,
        color: "var(--zen-text-primary)",
        mb: 0.8,
        fontSize: "1.1rem",
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: "'Lato', sans-serif",
        color: "var(--zen-text-secondary)",
        lineHeight: 1.65,
        mb: 2,
        flexGrow: 1,
      }}
    >
      {text}
    </Typography>
    <Button
      component={Link}
      to={link}
      size="small"
      sx={{
        alignSelf: "flex-start",
        borderRadius: "var(--zen-radius-full)",
        fontFamily: "'Urbanist', sans-serif",
        fontWeight: 600,
        textTransform: "none",
        fontSize: "0.85rem",
        color,
        background: bg,
        px: 2.5,
        py: 0.8,
        "&:hover": {
          background: accent,
          transform: "translateX(2px)",
        },
        transition: "all 0.2s ease",
      }}
    >
      Open →
    </Button>
  </div>
);

const FeaturesSection = () => (
  <section id="features" className="features-section">
    <Container maxWidth="lg">
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 6 }}>
        <Typography
          variant="overline"
          sx={{
            color: "var(--zen-primary)",
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.78rem",
          }}
        >
          Features
        </Typography>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            fontSize: { xs: "2rem", md: "2.6rem" },
            letterSpacing: "-0.02em",
            color: "var(--zen-text-primary)",
          }}
        >
          Everything you need to nurture your mind.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "var(--zen-text-secondary)",
            maxWidth: 500,
            fontFamily: "'Lato', sans-serif",
            lineHeight: 1.7,
          }}
        >
          Science-backed tools designed to support your mental wellness journey,
          every single day.
        </Typography>
      </Stack>

      <div className="features-bento">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </Container>
  </section>
);

export default FeaturesSection;
