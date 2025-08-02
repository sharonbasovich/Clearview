"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Description,
  Search,
  Tag,
  Keyboard,
  FlashOn,
  Security,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Ballpit from "@/components/ui/Ballpit";
import SplitText from "@/components/ui/SplitText";
import RotatingText from "@/components/ui/RotatingText";
import { motion } from "framer-motion";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Add custom styles for SplitText color
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .split-text-orange.split-parent {
        color: #FFB33B !important;
      }
      .split-text-blue.split-parent {
        color: #3BA4FF !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems: string[] = [];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ my: 2 }}>
        <SplitText
          text="Clearview"
          className="text-xl font-bold split-text-blue"
          delay={50}
          duration={0.8}
          from={{ opacity: 0, y: -20 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="center"
        />
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              fullWidth
              href="/auth"
              sx={{
                borderColor: "#FFB33B",
                color: "#FFB33B",
                "&:hover": {
                  borderColor: "#FFB33B",
                  backgroundColor: "rgba(255, 179, 59, 0.1)",
                },
              }}
            >
              <SplitText
                text="Sign In"
                delay={100}
                duration={0.6}
                from={{ opacity: 0, scale: 0.8 }}
                to={{ opacity: 1, scale: 1 }}
                threshold={0.1}
                rootMargin="-30px"
                textAlign="center"
                className="split-text-orange"
              />
            </Button>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              fullWidth
              href="/auth"
              sx={{
                backgroundColor: "#FFB33B",
                "&:hover": {
                  backgroundColor: "#E6A32E",
                },
              }}
            >
              <SplitText
                text="Get Started"
                delay={150}
                duration={0.6}
                from={{ opacity: 0, scale: 0.8 }}
                to={{ opacity: 1, scale: 1 }}
                threshold={0.1}
                rootMargin="-30px"
                textAlign="center"
              />
            </Button>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ position: "relative" }}>
      {/* Ballpit Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <Ballpit
          count={50}
          gravity={0.3}
          friction={0.99}
          wallBounce={0.8}
          followCursor={true}
          colors={[0xffb33b, 0x3ba4ff, 0x5d6f80]}
          maxSize={1.5}
          minSize={0.8}
        />
      </Box>
      {/* Navigation */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          zIndex: 1000,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SplitText
              text="Clearview"
              className="text-2xl font-bold split-text-blue"
              delay={50}
              duration={0.8}
              from={{ opacity: 0, y: -20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="left"
            />
          </Box>

          {!isMobile && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#FFB33B",
                  color: "#FFB33B",
                  "&:hover": {
                    borderColor: "#FFB33B",
                    backgroundColor: "rgba(255, 179, 59, 0.1)",
                  },
                }}
                href="/auth"
              >
                <SplitText
                  text="Sign In"
                  delay={100}
                  duration={0.6}
                  from={{ opacity: 0, scale: 0.8 }}
                  to={{ opacity: 1, scale: 1 }}
                  threshold={0.1}
                  rootMargin="-30px"
                  className="split-text-orange"
                />
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFB33B",
                  "&:hover": {
                    backgroundColor: "#E6A32E",
                  },
                }}
                href="/auth"
              >
                <SplitText
                  text="Get Started"
                  delay={150}
                  duration={0.6}
                  from={{ opacity: 0, scale: 0.8 }}
                  to={{ opacity: 1, scale: 1 }}
                  threshold={0.1}
                  rootMargin="-30px"
                />
              </Button>
            </Stack>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          zIndex: 1001,
        }}
      >
        {drawer}
      </Drawer>
      {/* Hero Section */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)",
          color: "white",
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(5px)",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Box
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 700,
                mb: 3,
                color: "white",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <span>Journal your</span>
              <motion.div
                layout
                transition={{
                  layout: { type: "spring", stiffness: 400, damping: 40 },
                }}
                style={{ display: "inline-block" }}
              >
                <RotatingText
                  texts={["life", "feelings", "day", "thoughts", "ideas"]}
                  mainClassName="px-3 sm:px-4 md:px-6 bg-white text-black overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-lg font-bold"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-1 sm:pb-2 md:pb-3"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                  auto={true}
                  loop={true}
                  splitBy="characters"
                  elementLevelClassName="text-black font-bold"
                />
              </motion.div>
            </Box>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.6,
                color: "white",
                textAlign: "center",
              }}
            >
              Clearview is a powerful, Notion-like note-taking app that helps
              you capture ideas, organize thoughts, and boost productivity with
              rich text editing and smart organization.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                href="/auth"
                sx={{
                  backgroundColor: "white",
                  color: "primary.main",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "grey.100",
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h2" gutterBottom>
            Everything you need to stay organized
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Powerful features designed to help you capture, organize, and share
            your ideas effortlessly.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <Description sx={{ fontSize: 48 }} />,
              title: "Rich Text Editing",
              description:
                "Powerful TipTap editor with full formatting support, headings, lists, and more.",
              color: "primary.main",
            },
            {
              icon: <Search sx={{ fontSize: 48 }} />,
              title: "Smart Search",
              description:
                "Find any note instantly with our powerful search that looks through titles, content, and tags.",
              color: "secondary.main",
            },
            {
              icon: <Tag sx={{ fontSize: 48 }} />,
              title: "Tag System",
              description:
                "Organize notes with custom tags and create your own organizational system.",
              color: "success.main",
            },
            {
              icon: <Keyboard sx={{ fontSize: 48 }} />,
              title: "Keyboard Shortcuts",
              description:
                "Boost productivity with extensive keyboard shortcuts for formatting and navigation.",
              color: "warning.main",
            },
            {
              icon: <FlashOn sx={{ fontSize: 48 }} />,
              title: "Auto-save",
              description:
                "Never lose your work. Notes are automatically saved as you type.",
              color: "info.main",
            },
            {
              icon: <Security sx={{ fontSize: 48 }} />,
              title: "Secure & Private",
              description:
                "Your notes are stored securely with privacy as our top priority.",
              color: "error.main",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight={600}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer */}
      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "grey.100",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2025 Clearview. Built with Next.js and Material UI.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
