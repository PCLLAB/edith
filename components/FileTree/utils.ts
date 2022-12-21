import { DirectoryJson, ExperimentJson } from "../../lib/common/models/types";
import { getIdFromPath } from "../../lib/common/models/utils";

type InternalNode = LeafNode & {
  children: (InternalNode | LeafNode)[];
};

type LeafNode = {
  key: string;
  title: string;
  isLeaf?: true;
};

export const buildTree = (
  experiments: ExperimentJson[],
  directories: DirectoryJson[]
) => {
  const dirMap: Record<string, InternalNode> = {};

  // Shortest prefixPath first, aka parent nodes first
  const orderedDirs = directories.sort((dirA, dirB) => {
    const lengthDiff = dirA.prefixPath.length - dirB.prefixPath.length;
    if (lengthDiff !== 0) return lengthDiff;

    return dirA.name.localeCompare(dirB.name);
  });

  const orderedExps = experiments.sort((expA, expB) =>
    expA.name.localeCompare(expB.name)
  );

  orderedDirs.forEach((dir) => {
    const node = {
      children: [],
      key: dir._id,
      title: dir.name,
    };

    dirMap[dir._id] = node;

    const parentId = getIdFromPath(dir.prefixPath);
    dirMap[parentId].children.push(node);
  });

  orderedExps.forEach((exp) => {
    const node = {
      key: exp._id,
      title: exp.name,
      /**
       * The Tree Component will provide values as well
       * leaf directories will SOMETIMES also have isLeaf: true
       * So far, only the switcherIcon callback prop does this
       */
      isLeaf: true as const,
    };

    dirMap[exp.directory].children.push(node);
  });

  return dirMap[orderedDirs[0]._id].children;
};
