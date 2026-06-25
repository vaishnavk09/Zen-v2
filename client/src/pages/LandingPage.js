import React from "react";
import HeroSection     from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import AboutSection    from "../components/landing/AboutSection";
import TeamSection     from "../components/landing/TeamSection";

const LandingPage = () => (
  <div style={{ background: "var(--zen-bg)", overflowX: "hidden" }}>
    <HeroSection />
    <FeaturesSection />
    <AboutSection />
    <TeamSection />
  </div>
);

export default LandingPage;
