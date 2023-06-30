import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { fetcher } from "../lib/client/fetcher";
import { UserJson } from "../lib/common/types/models";
import User from "../models/User";
import { PostUsersIdSetup } from "./api/v2/users/[id]/setup";
import { useEffect } from "react";

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
    setFocus,
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

  const onSubmit = handleSubmit(async ({ name, newPassword: password }) => {
    try {
      await fetcher<PostUsersIdSetup>({
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
    } catch {}
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  if (!user) {
    return (
      <Typography>
        This link is invalid or the account has already been setup. If you
        believe this is an error, contact an admin.
      </Typography>
    );
  }

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 8,
        }}
      >
        <Typography variant="h5" component="h1">
          Account Setup
        </Typography>
        <Card component="form" onSubmit={onSubmit} variant="outlined">
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              disabled
              sx={{
                mt: 1,
                mb: 2,
              }}
            />
            <TextField
              autoFocus
              label="Name"
              fullWidth
              {...register("name", { required: "A name is required" })}
              disabled={isSubmitted}
            />

            <TextField
              type="password"
              label="New password"
              fullWidth
              {...register("newPassword", {
                required: "A password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters.",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              disabled={isSubmitted}
            />
            <TextField
              type="password"
              label="Retype new password"
              fullWidth
              {...register("retypePassword", {
                validate: (v) =>
                  v === getValues("newPassword") ||
                  "Doesn't match new password",
              })}
              error={!!errors.retypePassword}
              helperText={errors.retypePassword?.message}
              disabled={isSubmitted}
            />
            {isSubmitted ? (
              <Alert severity="success">
                <AlertTitle>Setup complete!</AlertTitle>
                <Link href="/login">Continue to the login page.</Link>
              </Alert>
            ) : (
              <Box display="flex" justifyContent="end">
                <LoadingButton
                  variant="contained"
                  type="submit"
                  disabled={!(isDirty && isValid)}
                  loading={isSubmitting}
                >
                  Finish
                </LoadingButton>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Setup;
