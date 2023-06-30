import { PostCounterbalances } from "../../../pages/api/v2/counterbalances";
import {
  GetDirectories,
  PostDirectories,
} from "../../../pages/api/v2/directories";
import {
  DeleteDirectoriesId,
  GetDirectoriesId,
  PutDirectoriesId,
} from "../../../pages/api/v2/directories/[id]";
import { GetDirectoriesIdChildren } from "../../../pages/api/v2/directories/[id]/children";
import { GetDirectoriesRoots } from "../../../pages/api/v2/directories/roots";
import {
  GetExperiments,
  PostExperiments,
} from "../../../pages/api/v2/experiments";
import {
  DeleteExperimentsId,
  GetExperimentsId,
  PostExperimentsId,
  PutExperimentsId,
} from "../../../pages/api/v2/experiments/[id]";
import {
  DeleteExperimentsIdCache,
  GetExperimentsIdCache,
} from "../../../pages/api/v2/experiments/[id]/cache";
import {
  GetExperimentsIdData,
  PostExperimentsIdData,
} from "../../../pages/api/v2/experiments/[id]/data";
import { GetExperimentsIdMeta } from "../../../pages/api/v2/experiments/[id]/meta";
import { GetUsers, PostUsers } from "../../../pages/api/v2/users";
import {
  DeleteUsersId,
  GetUsersId,
  PutUsersId,
} from "../../../pages/api/v2/users/[id]";
import {
  DeleteUsersAuth,
  GetUsersAuth,
  PostUsersAuth,
} from "../../../pages/api/v2/users/auth";
import {
  GetCounterbalancesExpId,
  PutCounterbalancesExpId,
} from "../../../pages/api/v2/counterbalances/[expId]";
import { PostUsersIdSetup } from "../../../pages/api/v2/users/[id]/setup";
import { GetAssignExpId } from "../../../pages/api/v2/assign/[expId]";

/** Each unioned type represents a single URL endpoint */
export type ApiSignature =
  | Users
  | UsersAuth
  | UsersId
  | Experiments
  | ExperimentsId
  | ExperimentsIdData
  | ExperimentsIdCache
  | ExperimentIdMeta
  | Directories
  | DirectoriesId
  | DirectoriesIdChildren
  | DirectoriesRoots
  | Counterbalances
  | CounterbalancesExpId
  | AssignExpId;

type Users = GetUsers | PostUsers;
type UsersAuth = GetUsersAuth | PostUsersAuth | DeleteUsersAuth;
type UsersId = GetUsersId | PutUsersId | DeleteUsersId | PostUsersIdSetup;

type Experiments = GetExperiments | PostExperiments;
type ExperimentsId =
  | GetExperimentsId
  | PostExperimentsId
  | PutExperimentsId
  | DeleteExperimentsId;
type ExperimentsIdData = GetExperimentsIdData | PostExperimentsIdData;
type ExperimentsIdCache = GetExperimentsIdCache | DeleteExperimentsIdCache;
type ExperimentIdMeta = GetExperimentsIdMeta;

type Directories = GetDirectories | PostDirectories;
type DirectoriesId = PutDirectoriesId | GetDirectoriesId | DeleteDirectoriesId;
type DirectoriesIdChildren = GetDirectoriesIdChildren;
type DirectoriesRoots = GetDirectoriesRoots;

type Counterbalances = PostCounterbalances;
type CounterbalancesExpId = GetCounterbalancesExpId | PutCounterbalancesExpId;

type AssignExpId = GetAssignExpId;

export type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE";
