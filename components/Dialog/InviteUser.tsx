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
import { CodeBlock } from "../Code/Code";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

type Props = {
  onClose: () => void;
  id?: string;
};

export const InviteUserDialog = ({ onClose, id }: Props) => {
  const [email, setEmail] = useState("");
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
    console.log("mount dialog");
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
              margin="normal"
              id="name"
              type="text"
              label="Email"
              fullWidth
              variant="outlined"
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
              {`https://jarvis.psych.purdue.edu/setup/${createdUserId}`}
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
            href={`mailto:${email}?subject=Jarvis%20Account%20Setup&body=Welcome%20to%20Jarvis!%0D%0A%0D%0AUse%20the%20following%20link%20to%20create%20your%20password.%0D%0A%0D%0Ahttps%3A%2F%2Fjarvis.psych.purdue.edu%2Fsetup%2F${createdUserId}%0D%0A%0D%0AThis%20link%20can%20only%20be%20used%20to%20create%20a%20password%20once.`}
          >
            Open email client
          </Button>
        )}
      </DialogActions>
    </>
  );
};
