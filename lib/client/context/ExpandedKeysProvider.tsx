import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ExpandedKeys {
  expandedKeys: string[];
  setExpandedKeys: Dispatch<SetStateAction<string[]>>;
}

export const ExpandedKeysContext = createContext<ExpandedKeys>({
  expandedKeys: [],
  setExpandedKeys: () => {},
});

type Props = {
  children: ReactNode;
};
export const ExpandedKeysProvider = ({ children }: Props) => {
  const [expandedKeys, setExpandedKeys] = useState<
    ExpandedKeys["expandedKeys"]
  >([]);

  return (
    <ExpandedKeysContext.Provider
      value={{
        expandedKeys,
        setExpandedKeys,
      }}
    >
      {children}
    </ExpandedKeysContext.Provider>
  );
};
