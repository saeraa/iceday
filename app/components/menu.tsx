"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/Auth.context";
import { logoutUser } from "@/utils/firebase-functions";
import { useRouter } from "next/navigation";

const pages = ["Calendar", "Teams", "Leagues"];
const loggedOutSettings = ["Login", "Register"];
const loggedInSettings = ["Logout", "Account"];

export default function AppMenu() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const logoutAndRedirect = () => {
    logoutUser();
    router.push("/");
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ flexGrow: 1, padding: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            color="primary"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 800,
              letterSpacing: ".1rem",
              textDecoration: "none",
            }}
          >
            iceday
            <Box sx={{ display: { xs: "none", md: "flex" }, px: 2 }}>
              <Image
                src="/logo-icon.svg"
                alt="Iceday logo"
                width={60}
                height={60}
                priority
              />
            </Box>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu app bar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link href={page == "Calendar" ? "/" : page.toLowerCase()}>
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            color="primary"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              fontWeight: 800,
              flexGrow: 1,
              letterSpacing: ".1rem",
              textDecoration: "none",
            }}
          >
            {" "}
            <Box sx={{ display: { xs: "flex", md: "none" }, paddingRight: 2 }}>
              <Image
                src="/logo-icon.svg"
                alt="Iceday logo"
                width={30}
                height={30}
                priority
              />
            </Box>
            iceday
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                size="large"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, mx: 1, color: "white", display: "block" }}
              >
                <Link href={page == "Calendar" ? "/" : page.toLowerCase()}>
                  {page}
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              {authContext.user?.email ? (
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: "none", sm: "none", md: "block" },
                      mx: 2,
                      borderBottom: 2,
                    }}
                  >
                    Logged in as: {authContext.user.email}
                  </Typography>
                  <PersonIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <PersonIcon color="inherit" />
                </IconButton>
              )}
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {authContext.user?.email
                ? loggedInSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      {setting == "Logout" ? (
                        <Link href="/" onClick={logoutAndRedirect}>
                          Logout
                        </Link>
                      ) : (
                        <Link href={setting.toLowerCase()}>{setting}</Link>
                      )}
                    </MenuItem>
                  ))
                : loggedOutSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Link href={setting.toLowerCase()}>{setting}</Link>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
