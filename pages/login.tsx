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
import { UsersAuthPostSignature } from "./api/v2/users/auth";

const UNAUTHORIZED_ALERT = "Incorrect email or password.";
const SERVER_ERROR_ALERT = "Server error occured. 😓";

const Login: NextPage = () => {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersAuthPostSignature["body"]>();

  const onSubmit = useCallback(
    async (formData: UsersAuthPostSignature["body"]) => {
      setLoading(true);

      try {
        const data = await fetcher<UsersAuthPostSignature>({
          url: "/api/v2/users/auth",
          method: "POST",
          body: formData,
        });
        console.debug("login data", data);
        router.push("/explorer");
      } catch (e) {
        setLoading(false);

        if (e.status === 401) {
          setShowAlert(UNAUTHORIZED_ALERT);
          return;
        }

        setShowAlert(SERVER_ERROR_ALERT);
      }
    },
    []
  );

  const onRequestAccess = useCallback(() => {
    // TODO
    // show modal -> send somewhere? don't want email spam
  }, []);

  useEffect(() => {
    // Prefetch the explorer page
    router.prefetch("/explorer");
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="auto"
      alignItems="stretch"
      textAlign="center"
      maxWidth={320}
      gap={2}
      mt={8}
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
          Login to BEDI
        </Typography>
      </Box>
      {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert("")}>
          {showAlert}
        </Alert>
      )}
      <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 2,
          py: 3,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          error={!!errors.email}
          {...register("email", { required: true, pattern: /^.+@.+$/ })}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size="small"
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
      </Card>
      <Box>
        <Button variant="text" onClick={onRequestAccess}>
          Request Access
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
