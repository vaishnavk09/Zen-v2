import React from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import "./HeroSection.css";

const FloatingCard = ({ icon, label, value, className }) => (
  <div className={`hero-float-card ${className}`}>
    <span className="hero-float-card__icon">{icon}</span>
    <div>
      <div className="hero-float-card__value">{value}</div>
      <div className="hero-float-card__label">{label}</div>
    </div>
  </div>
);

const HeroSection = () => (
  <section className="hero-section">
    {/* Aurora mesh background blobs */}
    <div className="hero-blob hero-blob--purple" />
    <div className="hero-blob hero-blob--blue" />
    <div className="hero-blob hero-blob--lavender" />

    <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
      <div className="hero-inner">
        {/* Left: text */}
        <Stack spacing={3} className="hero-text-col">
          <Chip
            label="🌿 Mental Wellness Platform"
            size="small"
            sx={{
              alignSelf: "flex-start",
              background: "var(--zen-primary-10)",
              color: "var(--zen-primary)",
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: "0.78rem",
              letterSpacing: "0.04em",
              border: "1px solid var(--zen-primary-20)",
              borderRadius: "var(--zen-radius-full)",
              px: 0.5,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.6rem", md: "3.8rem", lg: "4.4rem" },
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--zen-text-primary)",
            }}
          >
            Take control of your{" "}
            <span className="hero-gradient-text">mental well-being.</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              color: "var(--zen-text-secondary)",
              maxWidth: 480,
              lineHeight: 1.7,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Zen helps you track your mood, journal your thoughts, practice
            breathing, and talk through challenges — all in one calm space.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              component={Link}
              to="/register"
              variant="contained"
              disableElevation
              size="large"
              sx={{
                borderRadius: "var(--zen-radius-full)",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                px: 4,
                py: 1.4,
                background: "linear-gradient(135deg, var(--zen-primary) 0%, var(--zen-primary-dark) 100%)",
                boxShadow: "0 8px 28px rgba(124,111,224,0.35)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 36px rgba(124,111,224,0.45)",
                  background: "linear-gradient(135deg, var(--zen-primary-light) 0%, var(--zen-primary) 100%)",
                },
                transition: "all 0.25s ease",
              }}
            >
              Get Started Free
            </Button>

            <Button
              component="a"
              href="#features"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "var(--zen-radius-full)",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                px: 4,
                py: 1.4,
                borderColor: "var(--zen-primary-20)",
                color: "var(--zen-text-primary)",
                "&:hover": {
                  borderColor: "var(--zen-primary)",
                  background: "var(--zen-primary-10)",
                },
              }}
            >
              See Features
            </Button>
          </Stack>

          {/* Trust strip */}
          <Stack direction="row" spacing={3} className="hero-trust-strip">
            <span>✅ Free to start</span>
            <span>🔒 Private &amp; encrypted</span>
            <span>⭐ 4.9 rated</span>
          </Stack>
        </Stack>

        {/* Right: illustration + floating cards */}
        <div className="hero-visual-col">
          <div className="hero-illustration-wrap">
            <img
              src="/meditation.svg"
              alt="Person meditating peacefully"
              className="hero-illustration"
            />

            <FloatingCard
              icon="🧘"
              label="Daily Streak"
              value="7 days"
              className="hero-float-card--top"
            />
            <FloatingCard
              icon="😊"
              label="Mood today"
              value="Calm"
              className="hero-float-card--bottom"
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default HeroSection;
