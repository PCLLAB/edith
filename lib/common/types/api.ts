import { CounterbalancesPostSignature } from "../../../pages/api/v2/counterbalances";
import {
  DirectoriesGetSignature,
  DirectoriesPostSignature,
} from "../../../pages/api/v2/directories";
import {
  DirectoriesIdDeleteSignature,
  DirectoriesIdGetSignature,
  DirectoriesIdPutSignature,
} from "../../../pages/api/v2/directories/[id]";
import { DirectoriesIdChildrenGetSignature } from "../../../pages/api/v2/directories/[id]/children";
import { DirectoriesRootsGetSignature } from "../../../pages/api/v2/directories/roots";
import {
  ExperimentsGetSignature,
  ExperimentsPostSignature,
} from "../../../pages/api/v2/experiments";
import {
  ExperimentsIdDeleteSignature,
  ExperimentsIdGetSignature,
  ExperimentsIdPostSignature,
  ExperimentsIdPutSignature,
} from "../../../pages/api/v2/experiments/[id]";
import {
  ExperimentsIdCacheDeleteSignature,
  ExperimentsIdCacheGetSignature,
} from "../../../pages/api/v2/experiments/[id]/cache";
import {
  ExperimentsIdDataGetSignature,
  ExperimentsIdDataPostSignature,
} from "../../../pages/api/v2/experiments/[id]/data";
import { ExperimentsIdMetaGetSignature } from "../../../pages/api/v2/experiments/[id]/meta";
import {
  UsersGetSignature,
  UsersPostSignature,
} from "../../../pages/api/v2/users";
import {
  UsersIdDeleteSignature,
  UsersIdGetSignature,
  UsersIdPutSignature,
} from "../../../pages/api/v2/users/[id]";
import { UsersAuthPostSignature } from "../../../pages/api/v2/users/auth";
import {
  CounterbalancesIdGetSignature,
  CounterbalancesIdPutSignature,
} from "../../../pages/api/v2/counterbalances/[id]";

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
  | CounterbalancesId;

type Users = UsersGetSignature | UsersPostSignature;
type UsersAuth = UsersAuthPostSignature;
type UsersId =
  | UsersIdGetSignature
  | UsersIdPutSignature
  | UsersIdDeleteSignature;

type Experiments = ExperimentsGetSignature | ExperimentsPostSignature;
type ExperimentsId =
  | ExperimentsIdGetSignature
  | ExperimentsIdPostSignature
  | ExperimentsIdPutSignature
  | ExperimentsIdDeleteSignature;
type ExperimentsIdData =
  | ExperimentsIdDataGetSignature
  | ExperimentsIdDataPostSignature;
type ExperimentsIdCache =
  | ExperimentsIdCacheGetSignature
  | ExperimentsIdCacheDeleteSignature;
type ExperimentIdMeta = ExperimentsIdMetaGetSignature;

type Directories = DirectoriesGetSignature | DirectoriesPostSignature;
type DirectoriesId =
  | DirectoriesIdPutSignature
  | DirectoriesIdGetSignature
  | DirectoriesIdDeleteSignature;
type DirectoriesIdChildren = DirectoriesIdChildrenGetSignature;
type DirectoriesRoots = DirectoriesRootsGetSignature;

type Counterbalances = CounterbalancesPostSignature;
type CounterbalancesId =
  | CounterbalancesIdGetSignature
  | CounterbalancesIdPutSignature;

export type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE";
