import { createContext, ReactNode, useState } from "react";

interface Workspace {
  rootId: string;
}

interface WorkspaceContext {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
}

export const WorkspaceContext = createContext<WorkspaceContext>({
  workspace: { rootId: "you forgot to add a provider" },
  setWorkspace: () => {},
});

type Props = {
  children: ReactNode;
};
export const WorkspaceProvider = ({ children }: Props) => {
  const [workspace, setWorkspace] = useState<Workspace>({
    rootId: "",
  });

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
