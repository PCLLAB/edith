import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { createMailtoLink } from "../../lib/common/utils";
import config from "../../lib/config";
import { CodeBlock } from "../Code/Code";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

type InviteUserProps = {
  id?: string;
  onClose: () => void;
};

export const InviteUserDialog = ({ onClose, id }: InviteUserProps) => {
  const user = useBoundStore((state) => (id ? state.userMap[id] : null));

  const [email, setEmail] = useState(user?.email ?? "");

  const [superuser, setSuperuser] = useState(false);
  const [loading, setLoading] = useState(false);

  const createUser = useBoundStore((state) => state.createUser);

  const [createdUserId, setCreatedUserId] = useState<string | undefined>(id);

  const step = createdUserId == null ? 0 : 1;

  const onNext = async () => {
    setLoading(true);
    const user = await createUser({ email, superuser });
    setCreatedUserId(user._id);
    setLoading(false);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>Invite user</DialogTitleWithClose>
      <Stepper activeStep={step} sx={{ mx: 2 }}>
        <Step completed={step === 1}>
          <StepLabel>Email</StepLabel>
        </Step>
        <Step>
          <StepLabel>Share link</StepLabel>
        </Step>
      </Stepper>
      <DialogContent>
        {step === 0 && (
          <>
            <FormLabel component="legend">
              The new user will use this to login.
            </FormLabel>
            <TextField
              inputRef={inputRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              id="name"
              type="text"
              label="Email"
              fullWidth
              margin="normal"
            />
            <FormLabel component="legend">
              Enable admin role for new user?
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    value={superuser}
                    onChange={(_, check) => setSuperuser(check)}
                  />
                }
                label={
                  <Typography
                    variant="button"
                    fontWeight="bold"
                    color={superuser ? "success.main" : "warning.main"}
                  >
                    {superuser ? "Admin" : "User"}
                  </Typography>
                }
              />
            </FormGroup>
          </>
        )}
        {step === 1 && (
          <>
            <DialogContentText>
              Share the link below, or use the <b>Open email client</b> button
              below to manually send a prefilled email.
            </DialogContentText>
            <CodeBlock>
              {`${config.NEXT_PUBLIC_SITE_URL}${config.NEXT_PUBLIC_BASE_PATH}/setup?id=${createdUserId}`}
            </CodeBlock>
          </>
        )}
      </DialogContent>

      <DialogActions>
        {step === 0 && (
          <Button onClick={onNext}>
            {loading ? <CircularProgress size={24} /> : "Next"}
          </Button>
        )}
        {step === 1 && (
          <Button
            href={createMailtoLink(
              email,
              `${config.NEXT_PUBLIC_SITE_NAME} Account Setup`,
              `Welcome to ${config.NEXT_PUBLIC_SITE_NAME}!\r\n\r\nUse the following link to create your password.\r\n\r\n${config.NEXT_PUBLIC_SITE_URL}${config.NEXT_PUBLIC_BASE_PATH}/setup?id=${createdUserId}\r\n\r\nOnce setup is complete, the link will no longer work.`
            )}
          >
            Open email client
          </Button>
        )}
      </DialogActions>
    </>
  );
};
