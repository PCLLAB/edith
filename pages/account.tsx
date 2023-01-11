import { NextPage } from "next";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import PersonIcon from "@mui/icons-material/Person";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import LoadingButton from "@mui/lab/LoadingButton";
import { SiteWideAppBar } from "../components/SiteWideAppBar";
import { AuthContext } from "../lib/client/context/AuthProvider";
import { DialogContextProvider } from "../lib/client/context/DialogContext";
import { useBoundStore } from "../lib/client/hooks/stores/useBoundStore";
import { UsersIdPutSignature } from "./api/v2/users/[id]";

const Account: NextPage = () => {
  const { user: authUser } = useContext(AuthContext);

  const user = useBoundStore((state) => state.userMap[authUser!._id]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isValid, errors, dirtyFields, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: user?.name,
      email: user?.email,
      oldPassword: "",
      newPassword: "",
      retypePassword: "",
    },
  });

  const updateUser = useBoundStore((state) => state.updateUser);

  const onSubmit = () => {
    console.log("submit");
    handleSubmit(async ({ name, email, oldPassword, newPassword }) => {
      const update: UsersIdPutSignature["body"] = {};

      if (dirtyFields.name) update.name = name;
      if (dirtyFields.email) update.email = email;
      if (dirtyFields.oldPassword) update.oldPassword = oldPassword;
      if (dirtyFields.newPassword) update.newPassword = newPassword;

      try {
        await updateUser(user!._id, update);
        reset();
      } catch {}
    })();
  };

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
              <CardContent>
                <Typography variant="h5" component="h2">
                  Profile
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  sx={{ mb: 2 }}
                  margin="normal"
                  {...register("name")}
                />
                <TextField
                  label="Email"
                  fullWidth
                  sx={{ mb: 2 }}
                  {...register("email")}
                />

                <Typography variant="h5" component="h2">
                  Change Password
                </Typography>
                <TextField
                  type="password"
                  label="Old password"
                  fullWidth
                  sx={{ mb: 2 }}
                  margin="normal"
                  {...register("oldPassword")}
                />
                <TextField
                  type="password"
                  label="New password"
                  fullWidth
                  sx={{ mb: 2 }}
                  {...register("newPassword", {
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters.",
                    },
                    validate: (v) =>
                      !!v === !!getValues("oldPassword") ||
                      "Old password and new password are required",
                  })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
                <TextField
                  type="password"
                  label="Retype new password"
                  fullWidth
                  sx={{ mb: 2 }}
                  {...register("retypePassword", {
                    validate: (v) =>
                      v === getValues("newPassword") ||
                      "Doesn't match new password",
                  })}
                  error={!!errors.retypePassword}
                  helperText={errors.retypePassword?.message}
                />
                <Box display="flex" justifyContent="end">
                  <LoadingButton
                    variant="contained"
                    disabled={!(isDirty && isValid)}
                    onClick={onSubmit}
                    loading={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContextProvider>
    </>
  );
};

export default Account;
