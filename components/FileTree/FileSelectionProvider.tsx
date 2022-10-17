import { createContext, ReactNode, useState } from "react";

export enum DirectoryFileType {
  DIR,
  EXP,
}

type Selection = {
  id: string;
  type: DirectoryFileType;
};

interface FileSelection {
  fileSelection: Selection | null;
  setFileSelection: (sel: Selection) => void;
}

export const FileSelectionContext = createContext<FileSelection>({
  fileSelection: null,
  setFileSelection: () => {},
});

type Props = {
  children: ReactNode;
};
export const FileSelectionProvider = ({ children }: Props) => {
  const [fileSelection, setFileSelection] =
    useState<FileSelection["fileSelection"]>(null);

  return (
    <FileSelectionContext.Provider
      value={{
        fileSelection,
        setFileSelection,
      }}
    >
      {children}
    </FileSelectionContext.Provider>
  );
};
