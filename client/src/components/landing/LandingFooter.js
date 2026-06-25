import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAuth } from "../../context/AuthContext";
import "./LandingFooter.css";

const LandingFooter = () => {
  const { user } = useAuth();

  return (
  <footer className="landing-footer">
    {/* Footer bar */}
    <div className="footer-bar">
      <Container maxWidth="lg">
        <div className="footer-bar__inner">
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Zen
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.40)",
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.82rem",
            }}
          >
            © 2025 Zen. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {!user && <Link to="/login" className="footer-link">Login</Link>}
            {!user && <Link to="/register" className="footer-link">Sign Up</Link>}
          </Stack>
        </div>
      </Container>
    </div>
  </footer>
);
};

export default LandingFooter;
