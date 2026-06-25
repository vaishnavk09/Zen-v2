import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useAuth } from "../../context/AuthContext";

const LandingNavbar = () => {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const isLanding = location.pathname === "/";

  const links = isLanding
    ? [
        { label: "Features", href: "#features" },
        { label: "About", href: "#about" },
        { label: "Team", href: "#team" },
        { label: "Contact Us", to: "/contact"}
      ]
    : [
        { label: "Journal", to: "/journal" },
        { label: "Mood", to: "/mood" },
        { label: "Chatbot", to: "/chatbot" },
        { label: "Breathing", to: "/breathing" },
        
      ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: scrolled
          ? "rgba(255,255,255,0.80)"
          : "rgba(248,247,255,0.60)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: scrolled
          ? "1px solid rgba(124,111,224,0.12)"
          : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto", px: { xs: 2, md: 4 }, py: 0.5 }}>
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h5"
          sx={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800,
            color: "primary.main",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            flexGrow: 1,
          }}
        >
          Zen
        </Typography>

        {/* Nav links */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          {links.map((item) => (
            <Button
              key={item.label}
              component={item.to ? Link : "a"}
              to={item.to}
              href={item.href}
              sx={{
                color: "var(--zen-text-secondary)",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 500,
                fontSize: "0.93rem",
                textTransform: "none",
                borderRadius: "var(--zen-radius-full)",
                px: 2,
                "&:hover": { color: "primary.main", background: "var(--zen-primary-10)" },
              }}
            >
              {item.label}
            </Button>
          ))}

          {!user ? (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  ml: 1,
                  borderRadius: "var(--zen-radius-full)",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "primary.light",
                  color: "primary.main",
                  px: 2.5,
                  "&:hover": { borderColor: "primary.main", background: "var(--zen-primary-10)" },
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                disableElevation
                sx={{
                  borderRadius: "var(--zen-radius-full)",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 2.5,
                  background: "linear-gradient(135deg, var(--zen-primary) 0%, var(--zen-primary-dark) 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, var(--zen-primary-light) 0%, var(--zen-primary) 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "var(--zen-shadow-md)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleProfileOpen}
                sx={{
                  ml: 1,
                  minWidth: 0,
                  width: 38,
                  height: 38,
                  p: 0,
                  borderRadius: "50%",
                  borderColor: "primary.light",
                  "&:hover": { borderColor: "primary.main", background: "var(--zen-primary-10)" },
                }}
              >
                <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: "primary.main" }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </Button>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled>
                  {user?.name || "User"}
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    handleProfileClose();
                    await handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default LandingNavbar;
