import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import "./TeamSection.css";

const team = [
  {
    name: "Manodnya Medhe",
    role: "Full-Stack Developer",
    bio: "Passionate about building accessible, human-centred digital experiences.",
    avatar: "",
  },
  {
    name: "Vaishnav Kedar",
    role: "Full-Stack Developer",
    bio: "Passionate about building accessible, human-centred digital experiences.",
    avatar: "",
  },
  {
    name: "Pratik Shinde",
    role: "Full-Stack Developer",
    bio: "Passionate about building accessible, human-centred digital experiences.",
    avatar: "",
  },
  {
    name: "Vaishnavi Kharat",
    role: "Full-Stack Developer",
    bio: "Passionate about building accessible, human-centred digital experiences.",
    avatar: "",
  },
];

const TeamCard = ({ name, role, bio, avatar }) => (
  <div className="team-card">
    <Avatar
      src={avatar}
      alt={name}
      sx={{
        width: 80,
        height: 80,
        mb: 2,
        border: "3px solid var(--zen-lavender)",
        boxShadow: "var(--zen-shadow-sm)",
      }}
    />
    <Typography
      variant="h6"
      sx={{
        fontFamily: "'Urbanist', sans-serif",
        fontWeight: 700,
        color: "var(--zen-text-primary)",
        fontSize: "1rem",
        mb: 0.4,
      }}
    >
      {name}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        fontFamily: "'Urbanist', sans-serif",
        fontWeight: 600,
        color: "var(--zen-primary)",
        fontSize: "0.78rem",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        display: "block",
        mb: 1.2,
      }}
    >
      {role}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: "'Lato', sans-serif",
        color: "var(--zen-text-secondary)",
        lineHeight: 1.65,
        fontSize: "0.88rem",
        textAlign: "center",
      }}
    >
      {bio}
    </Typography>
  </div>
);

const TeamSection = () => (
  <section id="team" className="team-section">
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
          Meet the Team
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
          Built with care by people who care.
        </Typography>
      </Stack>

      <div className="team-grid">
        {team.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>
    </Container>
  </section>
);

export default TeamSection;
