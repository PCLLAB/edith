import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { CounterbalanceJson } from "../../../../lib/common/types/models";

type Props = {
  cb: CounterbalanceJson;
};
export const Quotas = ({ cb }: Props) => {
  const quotas = (cb?.quotas ?? []).map((quota) => ({
    amount: quota.amount,
    progress: quota.progress,
    // Convert object with key values into list of obj w/ params and values
    params: Object.entries(quota.params).map(([param, value]) => ({
      param,
      value,
    })),
  }));

  const { control, register, getValues, setValue, watch } = useForm({
    defaultValues: {
      quotas,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quotas",
  });

  return (
    <Box>
      <Typography variant="h6" component="h2">
        Parameter Quotas
      </Typography>
      <Typography variant="body2" color="text.secondary">
        The assignment link will prioritize filling remaining quotas. Once all
        quotas are filled, assignment will continue without priority.
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} my={2}>
        {fields.map((field, i) => (
          <Quota
            key={field.id}
            index={i}
            control={control}
            register={register}
            onDelete={() => remove(i)}
            getValues={getValues}
            watch={watch}
            setValue={setValue}
            paramOptions={cb?.paramOptions ?? {}}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        fullWidth
        startIcon={<LibraryAddIcon />}
        onClick={() => append({ amount: 0, progress: 0, params: [] })}
        disabled={cb == null}
      >
        Add quota
      </Button>
    </Box>
  );
};

type QuotaProps = {
  // annoying generics
  control: Control<any>;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;

  onDelete: () => void;
  index: number;
  paramOptions: Record<string, string[]>;
};

const Quota = ({
  control,
  register,
  onDelete,
  getValues,
  index,
  paramOptions,
  watch,
  setValue,
}: QuotaProps) => {
  const { fields, append, remove } = useFieldArray({
    name: `quotas.${index}.params`,
    control,
  });

  console.log("quota render");

  const params = Object.keys(paramOptions);
  // const usedParams = getValues(`quotas.${index}.params`).map(
  //   (o: { param: string }) => o.param
  // );
  const usedParams = watch(
    fields.map((_, i) => `quotas.${index}.params.${i}.param`)
  );

  const unusedParams = params.filter((p) => !usedParams.includes(p));

  return (
    <Paper variant="outlined" sx={{ flexGrow: 1 }}>
      <List>
        <ListItem
          sx={{ gap: 2 }}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <TextField
            label="Quota"
            required
            size="small"
            {...register(`quotas.${index}.amount`, { required: true })}
          />
          <TextField
            disabled
            label="Progress"
            size="small"
            {...register(`quotas.${index}.progress`)}
          />
        </ListItem>
        <ListItem>
          <Typography variant="body1">Constraints</Typography>
        </ListItem>
        {fields.map((field, i) => (
          <ListItem
            key={field.id}
            sx={{ gap: 2 }}
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
            <Controller
              name={`quotas.${index}.params.${i}.param`}
              control={control}
              render={({ field: controlledField }) => (
                <TextField
                  select
                  size="small"
                  sx={{ flex: 1 }}
                  {...controlledField}
                  onChange={(e) => {
                    setValue(
                      `quotas.${index}.params.${i}.value`,
                      paramOptions[e.target.value][0]
                    );
                    controlledField.onChange(e);
                  }}
                >
                  {params
                    .filter(
                      (p) =>
                        p === getValues(`quotas.${index}.params.${i}.param`) ||
                        unusedParams.includes(p)
                    )
                    .map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
            <Controller
              name={`quotas.${index}.params.${i}.value`}
              control={control}
              render={({ field: controlledField }) => (
                <TextField
                  select
                  size="small"
                  sx={{ flex: 1 }}
                  {...controlledField}
                >
                  {paramOptions[
                    getValues(`quotas.${index}.params.${i}.param`)
                  ].map((v) => (
                    <MenuItem key={v} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </ListItem>
        ))}
        <ListItem secondaryAction={<IconButton edge="end" />}>
          <Button
            disabled={unusedParams.length === 0}
            variant="outlined"
            fullWidth
            onClick={() =>
              append({
                param: unusedParams[0],
                value: paramOptions[unusedParams[0]][0],
              })
            }
          >
            Add contraint
          </Button>
        </ListItem>
      </List>
    </Paper>
  );
};
