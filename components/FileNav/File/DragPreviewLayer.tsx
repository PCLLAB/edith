// Solution taken from answer on, still performance issues tho
// https://github.com/react-dnd/react-dnd/issues/592

import { DragLayerMonitor, useDragLayer } from "react-dnd";

import FolderIcon from "@mui/icons-material/Folder";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ReactDOM from "react-dom";
import { useRef, useCallback, useState } from "react";

export const DragPreviewLayer = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const lastTransform = useRef<string | null>(null);
  const isBusy = useRef(false);

  const getShouldRenderPreview = useCallback(
    (monitor: DragLayerMonitor): boolean => {
      const isDragging = monitor.isDragging();
      const item = monitor.getItem();
      if (!isDragging) {
        lastTransform.current = null;
        isBusy.current = false;
        return false;
      }

      if (isBusy.current) {
        return !!lastTransform.current;
      }

      const initialOffset = monitor.getInitialSourceClientOffset();
      const currentOffset = monitor.getSourceClientOffset();

      if (!initialOffset || !currentOffset) {
        lastTransform.current = null;
        isBusy.current = false;
        return false;
      }

      const { x, y } = currentOffset;

      const newTransform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      if (newTransform !== lastTransform.current) {
        isBusy.current = true;
        lastTransform.current = newTransform;
        requestAnimationFrame(() => {
          if (previewRef.current) {
            previewRef.current.style.transform = newTransform;
            console.log("raf");
            requestAnimationFrame(() => (isBusy.current = false));
          }
        });
      }
      return true;
    },
    []
  );

  const { item, shouldRenderPreview } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    shouldRenderPreview: getShouldRenderPreview(monitor),
  }));

  if (!shouldRenderPreview) {
    return null;
  }

  // const width = sourceRef.current?.offsetWidth;
  console.log("GOT", item);

  return ReactDOM.createPortal(
    <div
      style={{
        // ...(width ? { width: `${width}px` } : undefined),
        top: 0,
        left: 0,
        position: "absolute",
        pointerEvents: "none",
        ...(lastTransform.current
          ? { transform: lastTransform.current }
          : undefined),
      }}
      ref={previewRef}
    >
      <ListItem>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItem>
    </div>,
    document.body
  );
};
