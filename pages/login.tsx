import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UserService } from "../services/users";
import { PostReqBody } from "./api/v2/users/auth";
import Image from "next/image";
import betty from "../public/betty.png";
import Alert from "@mui/material/Alert";

const Login: NextPage = () => {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostReqBody>();

  const onSubmit = useCallback(async (formData: PostReqBody) => {
    const data = await UserService.login(formData);
    // Do a fast client-side transition to the already prefetched page
    if (data) {
      router.push("/explorer");
    } else {
      setShowAlert(true);
    }
  }, []);

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
        <Alert severity="error" onClose={() => setShowAlert(false)}>
          Incorrect email or password.
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
          variant="outlined"
          size="small"
          error={!!errors.password}
          {...register("password", { required: true })}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ textTransform: "none" }}
        >
          Login
        </Button>
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
