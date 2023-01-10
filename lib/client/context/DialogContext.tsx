import {
  Context,
  createContext,
  createElement,
  ReactNode,
  useContext,
  useState,
} from "react";

import { Dialog, DialogProps } from "@mui/material";

export type DialogType<T extends Record<string, (props: any) => ReactNode>> = {
  openDialog: (
    ...args: {
      [k in keyof T]: [
        key: k,
        props: Omit<Parameters<T[k]>[0], "onClose">,
        dialogProps?: Partial<DialogProps>
      ];
    }[keyof T]
  ) => void;
  closeDialog: () => void;
};

type BaseDialogObj = {
  key: string;
  props: any;
  dialogProps?: Partial<DialogProps>;
};

type BaseDialogVal = {
  openDialog: (
    key: any,
    props: any,
    dialogProps?: Partial<DialogProps>
  ) => void;
  closeDialog: () => void;
};

type DialogContextValue<T extends BaseDialogVal> = {
  closeDialog: T["closeDialog"];
  openDialog: T["openDialog"];
};

export const DialogContext = createContext<DialogContextValue<BaseDialogVal>>({
  closeDialog: () => {},
  openDialog: () => {},
});

type Props = {
  children: ReactNode;
  rendererMap: Record<string, (props: any) => JSX.Element>;
};

export const DialogContextProvider = ({ children, rendererMap }: Props) => {
  const [dialog, setDialog] = useState<BaseDialogObj | null>(null);
  const closeDialog = () => setDialog(null);

  // These types don't matter, since useDialogContext<T> will assert
  // them to a tighter type.
  const openDialog: BaseDialogVal["openDialog"] = (key, props, dialogProps) =>
    setDialog({ key, props, dialogProps });

  return (
    <DialogContext.Provider
      value={{
        closeDialog,
        openDialog,
      }}
    >
      {children}

      <Dialog
        open={!!dialog}
        fullWidth
        maxWidth="sm"
        {...dialog?.dialogProps}
        onClose={closeDialog}
      >
        {dialog &&
          createElement(rendererMap[dialog.key], {
            ...dialog.props,
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
export const useDialogContext = <T extends BaseDialogVal>() => {
  const context = useContext<DialogContextValue<T>>(
    DialogContext as unknown as Context<DialogContextValue<T>>
  );

  return context;
};
