import {
  DirectoriesGetSignature,
  DirectoriesPostSignature,
} from "../../../pages/api/v2/directories";
import { DirectoriesRootsGetSignature } from "../../../pages/api/v2/directories/roots";
import {
  DirectoriesIdDeleteSignature,
  DirectoriesIdGetSignature,
  DirectoriesIdPutSignature,
} from "../../../pages/api/v2/directories/[id]";
import { DirectoriesIdChildrenGetSignature } from "../../../pages/api/v2/directories/[id]/children";
import { fetcher } from "../fetcher";
import { useBoundStore } from "../hooks/stores/useBoundStore";

export const getDirectories = () =>
  fetcher<DirectoriesGetSignature>({
    url: "/api/v2/directories" as const,
    method: "GET" as const,
  }).then((dirs) => {
    useBoundStore.getState().updateDirectories(dirs);
  });

export const getDirectory = (id: string) =>
  fetcher<DirectoriesIdGetSignature>({
    url: "/api/v2/directories/[id]" as const,
    method: "GET" as const,
    query: { id },
  }).then((dir) => {
    useBoundStore.getState().updateDirectories([dir]);
  });

export const getDirectoryRoots = async () => {
  const roots = await fetcher<DirectoriesRootsGetSignature>({
    url: "/api/v2/directories/roots" as const,
    method: "GET" as const,
  });
  useBoundStore.getState().updateDirectories(roots);
  return roots;
};

export const updateDirectory = (
  id: string,
  update: DirectoriesIdPutSignature["body"]
) => {
  const original = useBoundStore.getState().directory[id];
  const optimistic = {
    ...original,
    ...update,
  };

  useBoundStore.getState().updateDirectories([optimistic]);

  fetcher<DirectoriesIdPutSignature>({
    url: "/api/v2/directories/[id]" as const,
    method: "PUT" as const,
    query: { id },
    body: update,
  })
    .then((dir) => {
      useBoundStore.getState().updateDirectories([dir]);
    })
    .catch(() => useBoundStore.getState().updateDirectories([original]));
};

export const deleteDirectory = (id: string) => {
  const original = useBoundStore.getState().directory[id];

  useBoundStore.getState().deleteDirectories([id]);

  fetcher<DirectoriesIdDeleteSignature>({
    url: "/api/v2/directories/[id]" as const,
    method: "DELETE" as const,
    query: { id },
  })
    .then(() => {
      // TODO optimization to free memory
      // remove all children directories from store as well
      // useBoundStore.getState().updateDirectories([]);
    })
    .catch(() => useBoundStore.getState().updateDirectories([original]));
};

export const createDirectory = (body: DirectoriesPostSignature["body"]) =>
  fetcher<DirectoriesPostSignature>({
    url: "/api/v2/directories" as const,
    method: "POST" as const,
    body,
  }).then((dir) => {
    useBoundStore.getState().updateDirectories([dir]);
  });

export const getDirectoryContent = (id: string) =>
  fetcher<DirectoriesIdChildrenGetSignature>({
    url: "/api/v2/directories/[id]/children" as const,
    method: "GET" as const,
    query: { id },
  }).then((content) => {
    console.debug("refresh dir content for ", id);
    useBoundStore.getState().updateDirectories(content.directories);
    useBoundStore.getState().updateExperiments(content.experiments);
  });
