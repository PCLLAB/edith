import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { fetcher } from "../lib/client/fetcher";
import betty from "../public/betty.png";
import { PostUsersAuth } from "./api/v2/users/auth";
import { CardContent, Container } from "@mui/material";
import config from "../lib/config";

const UNAUTHORIZED_ALERT = "Incorrect email or password.";
const SERVER_ERROR_ALERT = "Server error occured. 😓";

const Login: NextPage = () => {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<PostUsersAuth["body"]>();

  const onSubmit = handleSubmit(async (formData: PostUsersAuth["body"]) => {
    setLoading(true);

    try {
      const data = await fetcher<PostUsersAuth>({
        url: "/api/v2/users/auth",
        method: "POST",
        body: formData,
      });
      console.debug("login data", data);
      router.push("/explorer");
    } catch (e: any) {
      setLoading(false);

      if (e.status === 401) {
        setShowAlert(UNAUTHORIZED_ALERT);
        return;
      }

      setShowAlert(SERVER_ERROR_ALERT);
    }
  });

  const onRequestAccess = useCallback(() => {
    // TODO
    // show modal -> send somewhere? don't want email spam
  }, []);

  useEffect(() => {
    router.prefetch("/explorer");
  }, []);

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        textAlign: "center",
        gap: 2,
        mt: 8,
      }}
    >
      <Box>
        <Box
          borderRadius="50%"
          width={64}
          height={64}
          overflow="hidden"
          margin="auto"
        >
          <Image src={betty} alt="Betty White" />
        </Box>
        <Typography variant="h5" component="h1">
          Login to {config.NEXT_PUBLIC_SITE_NAME}
        </Typography>
      </Box>
      {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert("")}>
          {showAlert}
        </Alert>
      )}
      <Card component="form" onSubmit={onSubmit} variant="outlined">
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            error={!!errors.email}
            {...register("email", { required: true, pattern: /^.+@.+$/ })}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            error={!!errors.password}
            {...register("password", { required: true })}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ textTransform: "none" }}
            loading={loading}
          >
            Login
          </LoadingButton>
        </CardContent>
      </Card>
      <Box>
        <Button variant="text" onClick={onRequestAccess}>
          Request Access
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
