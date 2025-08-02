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
          backgroundColor: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <SplitText
              text="Clearview"
              className="text-3xl font-bold split-text-blue"
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
                size="large"
                sx={{
                  borderColor: "#FFB33B",
                  color: "#FFB33B",
                  fontSize: "1.1rem",
                  px: 3,
                  py: 1.5,
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
                size="large"
                sx={{
                  backgroundColor: "#FFB33B",
                  fontSize: "1.1rem",
                  px: 3,
                  py: 1.5,
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
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(250,119,66, 0.8) 0%, rgba(254,203,43, 0.8) 100%)",
            color: "white",
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            borderRadius: 4,
            backdropFilter: "blur(5px)",
            textAlign: "center",
            maxWidth: "800px",
            mx: 2,
          }}
        >
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
              flexWrap: "nowrap",
              gap: 2,
              minHeight: { xs: "5rem", md: "8rem" },
              overflow: "visible",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Journal your</span>
            <motion.div
              layout
              transition={{
                layout: { type: "spring", stiffness: 400, damping: 40 },
              }}
              style={{
                display: "inline-block",
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
              <RotatingText
                texts={["life", "feelings", "day", "thoughts", "ideas"]}
                mainClassName="px-3 sm:px-4 md:px-6 bg-white rounded-lg font-bold flex items-center justify-center overflow-hidden"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="flex items-center"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                auto={true}
                loop={true}
                splitBy="characters"
                elementLevelClassName="font-bold"
                style={{ color: "#8e59ff" }}
              />
            </motion.div>
          </Box>
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
              Get Started
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
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
