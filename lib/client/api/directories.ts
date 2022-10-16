import {
  DirectoriesGetSignature,
  DirectoriesPostSignature,
} from "../../../pages/api/v2/directories";
import { DirectoriesIdGetSignature } from "../../../pages/api/v2/directories/[id]";
import { DirectoriesIdChildrenGetSignature } from "../../../pages/api/v2/directories/[id]/children";
import { fetcher } from "../fetcher";
import { useDirectoryStore } from "../hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../hooks/stores/useExperimentStore";

export const getDirectories = () =>
  fetcher<DirectoriesGetSignature>({
    url: "/api/v2/directories" as const,
    method: "GET" as const,
  }).then((dirs) => {
    useDirectoryStore.getState().updateDirectories(dirs);
  });

export const getDirectoryById = (id: string) =>
  fetcher<DirectoriesIdGetSignature>({
    url: "/api/v2/directories/[id]" as const,
    method: "GET" as const,
    query: { id },
  }).then((dir) => {
    useDirectoryStore.getState().updateDirectories([dir]);
  });

export const createDirectory = (body: DirectoriesPostSignature["body"]) =>
  fetcher<DirectoriesPostSignature>({
    url: "/api/v2/directories" as const,
    method: "POST" as const,
    body,
  }).then((dir) => {
    useDirectoryStore.getState().updateDirectories([dir]);
  });

export const getDirectoryContent = (id: string) =>
  fetcher<DirectoriesIdChildrenGetSignature>({
    url: "/api/v2/directories/[id]/children" as const,
    method: "GET" as const,
    query: { id },
  }).then((content) => {
    useDirectoryStore.getState().updateDirectories(content.directories);
    useExperimentStore.getState().updateExperiments(content.experiments);
  });
