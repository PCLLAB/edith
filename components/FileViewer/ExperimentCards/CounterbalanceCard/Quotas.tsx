import { Box, Typography } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
type Props = {
  expId: string;
};
export const Quotas = ({ expId }: Props) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[expId]);

  const { control } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "quotas",
  });

  return (
    <Box>
      <Typography variant="h6" component="h2">
        Parameter Quotas
      </Typography>
    </Box>
  );
};
