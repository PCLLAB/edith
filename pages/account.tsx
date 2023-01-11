import { NextPage } from "next";

import PersonIcon from "@mui/icons-material/Person";
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import { SiteWideAppBar } from "../components/SiteWideAppBar";
import { DialogContextProvider } from "../lib/client/context/DialogContext";
import { useContext } from "react";
import { AuthContext } from "../lib/client/context/AuthProvider";

const Account: NextPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <DialogContextProvider rendererMap={{}}>
        <SiteWideAppBar />
        <Box display="flex" height="100%">
          <Paper elevation={0} sx={{ flexBasis: 320 }}>
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </List>
          </Paper>
          <Box
            flex={1}
            p={3}
            display="flex"
            flexDirection="column"
            height="100%"
            gap={2}
          >
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" component="h2">
                  Profile
                </Typography>
                {/* <Typography variant="h6">Name</Typography> */}
                <TextField
                  label="Name"
                  fullWidth
                  sx={{ mb: 2 }}
                  defaultValue={user?.name}
                  margin="normal"
                />
                <TextField
                  label="Email"
                  fullWidth
                  sx={{ mb: 2 }}
                  defaultValue={user?.email}
                />

                <Typography variant="h5" component="h2">
                  Change Password
                </Typography>
                <TextField
                  label="Old password"
                  fullWidth
                  sx={{ mb: 2 }}
                  margin="normal"
                />
                <TextField label="New password" fullWidth sx={{ mb: 2 }} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContextProvider>
    </>
  );
};

export default Account;
