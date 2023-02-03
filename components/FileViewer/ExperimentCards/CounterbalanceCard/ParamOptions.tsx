import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
import LoadingButton from "@mui/lab/LoadingButton";
import { CounterbalanceJson } from "../../../../lib/common/types/models";
import { useEffect } from "react";

type ParamOptionsProps = {
  cb?: CounterbalanceJson;
};

// Transform to format required for form
const getFormParamOptions = (paramOptions: Record<string, string[]>) =>
  Object.entries(paramOptions).map(([param, options]) => ({
    param,
    options: options.map((value) => ({
      value,
    })),
  }));

export const ParamOptions = ({ cb }: ParamOptionsProps) => {
  const updateCounterbalance = useBoundStore(
    (state) => state.updateCounterbalance
  );

  const {
    control,
    register,
    formState: { isDirty, isValid, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      paramOptions: getFormParamOptions(cb?.paramOptions ?? {}),
    },
    // mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "paramOptions",
    control,
  });

  const onSubmit = handleSubmit(async ({ paramOptions: formParamOptions }) => {
    const paramOptions = Object.fromEntries(
      formParamOptions.map((po) => [
        po.param,
        po.options.map((option) => option.value),
      ])
    );

    await updateCounterbalance(cb!.experiment, {
      paramOptions,
    });
  });

  useEffect(() => {
    reset(getValues());
  }, [isSubmitSuccessful]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Typography variant="h6" component="h2">
          Parameters
        </Typography>
        <Box marginLeft="auto">
          {isDirty && isValid && (
            <Typography variant="caption" color="warning.light">
              *Unsaved changes
            </Typography>
          )}
          {isDirty && !isValid && (
            <Typography variant="caption" color="error.light">
              *Invalid changes
            </Typography>
          )}
        </Box>
        <LoadingButton
          sx={{
            ml: 1,
          }}
          variant="contained"
          disabled={!(isDirty && isValid)}
          size="small"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Save
        </LoadingButton>
      </Box>
      <Typography variant="body2" color="text.secondary">
        One option from each parameter will be passed to the base experiment
        link as a URL query parameter.
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={3}>
        {fields.map((field, i) => (
          <Parameter
            key={field.id}
            index={i}
            control={control}
            register={register}
            onDelete={() => remove(i)}
          />
        ))}
        <Box sx={{ flex: 1, minWidth: 200, mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LibraryAddIcon />}
            onClick={() => append({ param: "", options: [{ value: "" }] })}
            disabled={cb == null}
          >
            Add parameter
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

type ParameterProps = {
  // annoying generics
  control: Control<any>;
  register: UseFormRegister<any>;

  onDelete: () => void;
  index: number;
};

const Parameter = ({ control, register, onDelete, index }: ParameterProps) => {
  const { fields, append, remove } = useFieldArray({
    name: `paramOptions.${index}.options`,
    control,
  });

  return (
    <List sx={{ flex: 1, minWidth: 200 }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        }
        sx={{ pl: 0 }}
      >
        <TextField
          label="Parameter Name"
          required
          fullWidth
          size="small"
          {...register(`paramOptions.${index}.param`, {
            required: true,
          })}
        />
      </ListItem>
      {fields.map((field, i) => (
        <ListItem
          key={field.id}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="remove"
              onClick={() => remove(i)}
            >
              {/* Don't show remove button if only one  */}
              {fields.length === 1 ? null : <RemoveIcon />}
            </IconButton>
          }
        >
          <TextField
            label={`Option ${i + 1}`}
            required
            fullWidth
            size="small"
            {...register(`paramOptions.${index}.options.${i}.value`, {
              required: true,
            })}
          />
        </ListItem>
      ))}
      <ListItem secondaryAction={<IconButton edge="end" />}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => append({ value: "" })}
        >
          Add option
        </Button>
      </ListItem>
    </List>
  );
};
