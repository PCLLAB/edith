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
import config from "../lib/config";
import Link from "next/link";
import { fetcher } from "../lib/client/fetcher";
import { UsersAuthDeleteSignature } from "../pages/api/v2/users/auth";

export const SiteWideAppBar = () => {
  const { me } = useContext(AuthContext);

  const router = useRouter();

  const anchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const onToggleMenu = () => setMenuOpen((prev) => !prev);

  const initials = me?.name
    .split(" ")
    .map((w) => w.at(0))
    .join("");

  const onLogout = () => {
    fetcher<UsersAuthDeleteSignature>({
      method: "DELETE",
      url: "/api/v2/users/auth",
    }).then(() => {
      router.push("/login");
    });
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography>{config.NEXT_PUBLIC_SITE_NAME}</Typography>
        <Box>
          <Tooltip title="Settings">
            <IconButton onClick={onToggleMenu}>
              <Avatar
                ref={anchorRef}
                sx={{
                  bgcolor: "secondary.main",
                  width: 32,
                  height: 32,
                }}
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
            <Link href="/account">
              <MenuItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText>Manage Account</ListItemText>
              </MenuItem>
            </Link>
            {me?.superuser && (
              <Link href="/admin">
                <MenuItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText>Admin Panel</ListItemText>
                </MenuItem>
              </Link>
            )}
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
