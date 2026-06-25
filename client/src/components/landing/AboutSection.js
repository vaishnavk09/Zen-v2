import React, { useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ShieldCheck, FlaskConical, Smartphone } from "lucide-react";
import "./AboutSection.css";

const benefits = [
  {
    icon: <FlaskConical size={20} />,
    title: "Science-backed tools",
    text: "Our features are grounded in CBT and mindfulness research.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Private & secure",
    text: "Your data stays yours. End-to-end encrypted and never shared.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Always with you",
    text: "Available on any device, whenever you need it.",
  },
];

const stats = [
  { value: "500+", label: "Active Users" },
  { value: "4.9★", label: "Average Rating" },
  { value: "10k+", label: "Sessions Completed" },
];

const AboutSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section-zen" ref={sectionRef}>
      <Container maxWidth="lg">
        <div className="about-inner">
          {/* Left: text + benefits */}
          <div className="about-text-col">
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
              Why Zen?
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.8rem" },
                letterSpacing: "-0.02em",
                color: "var(--zen-text-primary)",
                mt: 1.5,
                mb: 2,
                lineHeight: 1.15,
              }}
            >
              Built for your mental wellness journey.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "var(--zen-text-secondary)",
                fontFamily: "'Lato', sans-serif",
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 460,
              }}
            >
              We believe mental wellness should be accessible, private, and
              genuinely useful. Zen is built by people who care about the
              science and the human experience behind it.
            </Typography>

            <Stack spacing={2.5}>
              {benefits.map((b) => (
                <div key={b.title} className="about-benefit">
                  <div className="about-benefit__icon">{b.icon}</div>
                  <div>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 700,
                        color: "var(--zen-text-primary)",
                        fontSize: "0.97rem",
                        mb: 0.3,
                      }}
                    >
                      {b.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Lato', sans-serif",
                        color: "var(--zen-text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {b.text}
                    </Typography>
                  </div>
                </div>
              ))}
            </Stack>
          </div>

          {/* Right: stats tiles */}
          <div className="about-stats-col">
            <div className="about-stats-grid">
              {stats.map((s) => (
                <div key={s.label} className="about-stat-tile">
                  <div className="about-stat-tile__value">{s.value}</div>
                  <div className="about-stat-tile__label">{s.label}</div>
                </div>
              ))}
              <div className="about-stat-tile about-stat-tile--wide about-stat-tile--accent">
                <div className="about-stat-tile__quote">
                  "Zen helped me understand my emotions in a completely new way."
                </div>
                <div className="about-stat-tile__author">— Verified User</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
