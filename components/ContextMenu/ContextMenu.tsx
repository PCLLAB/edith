import { ReactNode, useState } from "react";

import { Menu } from "@mui/material";

type ItemProps = {
  onClose: () => void;
};
type Props = {
  renderItems: ({ onClose }: ItemProps) => ReactNode;
  children?: ReactNode;
  className?: string;
};

export const ContextMenu = ({ renderItems, children, className }: Props) => {
  const [contextMenu, setContextMenu] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const onContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      !!contextMenu ? null : { left: event.clientX, top: event.clientY }
    );
  };

  const onClose = () => setContextMenu(null);

  const items = renderItems({ onClose });

  return (
    <div onContextMenu={onContextMenu} className={className}>
      {children}
      <Menu
        open={!!contextMenu}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ?? undefined}
      >
        {/* @ts-ignore <Menu/> only accepts arrays, so use children */}
        {Array.isArray(items) ? items : items.props.children}
      </Menu>
    </div>
  );
};
