/// Based on https://github.com/uptick/react-keyed-file-browser/blob/master/src/headers/table.js

import React from "react";
import ClassNames from "classnames";

import { DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { BaseFileConnectors } from "react-keyed-file-browser";

interface MyRawTableHeaderProps {
  fileKey: string;

  /// these come from react-dnd via DropTarget()
  /// we make these available if at least one of the handlers in browserProps is defined
  connectDropTarget: (x: JSX.Element) => JSX.Element;
  isOver: boolean;
  isSelected: boolean;

  browserProps: {
    createFiles?: () => void;
    moveFolder?: () => void;
    moveFile?: () => void;
  };
}

/**
 * This is a slightly refactored version of the RawTableHeader
 * from "react-keyed-file-browser"
 * 
 * It allows for custom header columns as child elements, i.e list of <th>
 */
const MyRawTableHeader = (
  props: React.PropsWithChildren<MyRawTableHeaderProps>
) => {
  const header = (
    <tr
      className={ClassNames("folder", {
        dragover: props.isOver,
        selected: props.isSelected,
      })}
    >
      {props.children}
    </tr>
  );

  const isDropTarget =
    typeof props.browserProps.createFiles === "function" ||
    typeof props.browserProps.moveFile === "function" ||
    typeof props.browserProps.moveFolder === "function";

  return isDropTarget ? props.connectDropTarget(header) : header;
};

const MyTableHeader = DropTarget(
  ["file", "folder", NativeTypes.FILE],
  BaseFileConnectors.targetSource,
  BaseFileConnectors.targetCollect
)(MyRawTableHeader);

export default MyTableHeader;
export { MyRawTableHeader };
