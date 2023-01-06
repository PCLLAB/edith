import { useContext, useRef, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { AuthContext } from "../lib/client/context/AuthProvider";
import { useRouter } from "next/router";

export const SiteWideAppBar = () => {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const anchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const onToggleMenu = () => setMenuOpen((prev) => !prev);

  const initials = user?.name
    .split(" ")
    .map((w) => w.at(0))
    .join("");

  const onAccountPage = () => {
    router.push("/account");
  };
  const onAdminPage = () => {
    router.push("/admin");
  };
  const onLogout = () => {
    // TODO actually clear credentials
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography>Jarvis</Typography>
        <Box>
          <Tooltip title="Settings">
            <IconButton onClick={onToggleMenu}>
              <Avatar
                ref={anchorRef}
                sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: 1 }}
            keepMounted
            open={menuOpen}
            onClose={onToggleMenu}
            anchorEl={anchorRef.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={onAccountPage}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>Manage Account</ListItemText>
            </MenuItem>
            <MenuItem onClick={onAdminPage}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText>Admin Panel</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
