import { GetServerSideProps, NextPage } from "next";
import { useForm } from "react-hook-form";

import PersonIcon from "@mui/icons-material/Person";
import LoadingButton from "@mui/lab/LoadingButton";
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

import { fetcher } from "../lib/client/fetcher";
import { UserJson } from "../lib/common/types/models";
import User from "../models/User";
import { UsersIdSetupPostSignature } from "./api/v2/users/[id]/setup";

type Props = {
  user: UserJson | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  try {
    const user = await User.findById(context.query.id).lean();
    // User has already been setup
    if (user.name != null || user.password != null) {
      throw "User already setup";
    }

    // idk, nextjs won't stringify objects like _id, createdAt, updatedAt
    const fix = JSON.parse(JSON.stringify(user));

    return {
      props: {
        user: fix,
      },
    };
  } catch {
    return {
      props: {
        user: null,
      },
    };
  }
};

const Setup: NextPage<Props> = ({ user }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isValid, errors, isSubmitting, isSubmitted },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: user?.email,
      newPassword: "",
      retypePassword: "",
    },
  });

  const onSubmit = () => {
    handleSubmit(async ({ name, newPassword: password }) => {
      try {
        await fetcher<UsersIdSetupPostSignature>({
          body: {
            name,
            password,
          },
          method: "POST",
          url: "/api/v2/users/[id]/setup",
          query: {
            id: user!._id,
          },
        });
        // TODO reroute to login ?
        // reset();
      } catch {}
    })();
  };

  if (!user) {
    return null;
  }

  return (
    <>
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
              <TextField
                label="Email"
                fullWidth
                sx={{ mb: 2 }}
                {...register("email")}
                disabled
              />
              <Typography variant="h5" component="h2">
                Profile
              </Typography>
              <TextField
                label="Name"
                fullWidth
                sx={{ mb: 2 }}
                margin="normal"
                {...register("name", { required: "A name is required" })}
              />

              <Typography variant="h5" component="h2">
                Setup Password
              </Typography>
              <TextField
                type="password"
                label="New password"
                fullWidth
                sx={{ mb: 2 }}
                {...register("newPassword", {
                  required: "A password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters.",
                  },
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
    </>
  );
};

export default Setup;
