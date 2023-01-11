import { ReactNode, useState } from "react";

import { Box, Menu, SxProps } from "@mui/material";

type ItemProps = {
  onClose: () => void;
};
type Props = {
  renderItems: ({ onClose }: ItemProps) => ReactNode;
  children?: ReactNode;
  sx?: SxProps;
};

export const ContextMenu = ({ renderItems, children, sx }: Props) => {
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
    <Box onContextMenu={onContextMenu} sx={sx}>
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
