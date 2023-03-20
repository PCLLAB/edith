import { ReactNode, useState } from "react";

import { Box, Menu, SxProps } from "@mui/material";

type ItemProps = {
  onClose: () => void;
};
type Props = {
  renderItems: ({ onClose }: ItemProps) => ReactNode;
  children?: ReactNode;
  sx?: SxProps;
} & React.ComponentPropsWithoutRef<"div">;

export const ContextMenu = ({ renderItems, children, sx, ...other }: Props) => {
  const [contextMenu, setContextMenu] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu(
      !!contextMenu ? null : { left: event.clientX, top: event.clientY }
    );
    if (other.onContextMenu != null) other.onContextMenu(event);
  };

  const onClose = () => setContextMenu(null);

  const items = renderItems({ onClose });

  return (
    <Box sx={sx} {...other} onContextMenu={onContextMenu}>
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
    </Box>
  );
};
