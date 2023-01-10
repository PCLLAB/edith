import {
  Context,
  createContext,
  createElement,
  ReactNode,
  useContext,
  useState,
} from "react";

import { Dialog, DialogProps } from "@mui/material";

import { DistributiveOmit } from "../../common/tsUtils";

export type CreateDialogType<
  T extends Record<string, (props: any) => ReactNode>
> = {
  [k in keyof T]: Parameters<T[k]>[0] & { type: k };
}[keyof T];

type BaseDialog = {
  type: string;
  dialogProps?: Partial<DialogProps>;
};

type DialogWithInternalProps = BaseDialog & {
  onClose: () => void;
};

type DialogContextValue<T extends BaseDialog> = {
  closeDialog: () => void;
  openDialog: (dialog: T) => void;
  dialog: T | null;
};

export const DialogContext = createContext<DialogContextValue<BaseDialog>>({
  closeDialog: () => {},
  openDialog: () => {},
  dialog: null,
});

type Props<T extends DialogWithInternalProps> = {
  children: ReactNode;
  /**
   * T is a union of objects where each object is the intersection of
   * the dialog props and a type field
   *
   * This uses the distributive conditional type to create a mapping
   * between the type field and a component that takes the specific props
   */
  rendererMap: T extends any
    ? {
        [key in T["type"]]: (props: T) => JSX.Element;
      }
    : never;
};

export const DialogContextProvider = <T extends DialogWithInternalProps>({
  children,
  rendererMap,
}: Props<T>) => {
  const [dialog, setDialog] = useState<BaseDialog | null>(null);
  const closeDialog = () => setDialog(null);

  return (
    <DialogContext.Provider
      value={{
        closeDialog,
        openDialog: setDialog,
        dialog,
      }}
    >
      {children}

      <Dialog
        open={!!dialog}
        fullWidth
        maxWidth={dialog?.dialogProps?.maxWidth ?? "sm"}
        onClose={closeDialog}
      >
        {dialog &&
          createElement(rendererMap[dialog.type], {
            ...dialog,
            onClose: closeDialog,
          })}
      </Dialog>
    </DialogContext.Provider>
  );
};

/**
 * This is a helper that conveniently types the context values using
 * the same generic type used to type the DialogContextProvider
 *
 * This avoids having to manually type `useContext(DialogContext)`
 * or define another type
 *
 * @returns Tightly typed context values for DialogContext
 */
export const useDialogContext = <T extends DialogWithInternalProps>() => {
  const context = useContext<
    DialogContextValue<DistributiveOmit<T, "onClose">>
  >(
    DialogContext as unknown as Context<
      DialogContextValue<DistributiveOmit<T, "onClose">>
    >
  );

  return context;
};
