import { createContext, ReactNode, useState } from "react";

interface Workspace {
  name: string;
  rootId: string;
}

export const WorkspaceContext = createContext<Workspace>({
  name: "Fallback",
  rootId: "",
});

type Props = {
  children: ReactNode;
};
export const WorkspaceProvider = ({ children }: Props) => {
  const [workspace, setWorkspace] = useState<Workspace>({
    name: "Main",
    // Hardcoded for now, since only one workspace
    rootId: "",
  });

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};
