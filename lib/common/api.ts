import {
  DirectoriesGetSignature,
  DirectoriesPostSignature,
} from "../../pages/api/v2/directories";
import {
  DirectoriesIdDeleteSignature,
  DirectoriesIdGetSignature,
  DirectoriesIdPutSignature,
} from "../../pages/api/v2/directories/[id]";
import { DirectoriesIdChildrenGetSignature } from "../../pages/api/v2/directories/[id]/children";
import {
  ExperimentsGetSignature,
  ExperimentsPostSignature,
} from "../../pages/api/v2/experiments";
import {
  ExperimentsIdDeleteSignature,
  ExperimentsIdPostSignature,
  ExperimentsIdPutSignature,
} from "../../pages/api/v2/experiments/[id]";
import {
  ExperimentsIdCacheDeleteSignature,
  ExperimentsIdCacheGetSignature,
} from "../../pages/api/v2/experiments/[id]/cache";
import {
  ExperimentsIdDataGetSignature,
  ExperimentsIdDataPostSignature,
} from "../../pages/api/v2/experiments/[id]/data";
import {
  UsersGetSignature,
  UsersPostSignature,
} from "../../pages/api/v2/users";
import {
  UsersIdDeleteSignature,
  UsersIdGetSignature,
  UsersIdPutSignature,
} from "../../pages/api/v2/users/[id]";
import { UsersAuthPostSignature } from "../../pages/api/v2/users/auth";

export type ApiSignature =
  | Users
  | UsersAuth
  | UsersId
  | Experiments
  | ExperimentsId
  | ExperimentsIdData
  | ExperimentsIdCache
  | Directories
  | DirectoriesId
  | DirectoriesIdChildren;

type Users = UsersGetSignature | UsersPostSignature;
type UsersAuth = UsersAuthPostSignature;
type UsersId =
  | UsersIdGetSignature
  | UsersIdPutSignature
  | UsersIdDeleteSignature;

type Experiments = ExperimentsGetSignature | ExperimentsPostSignature;
type ExperimentsId =
  | ExperimentsIdPostSignature
  | ExperimentsIdPutSignature
  | ExperimentsIdDeleteSignature;
type ExperimentsIdData =
  | ExperimentsIdDataGetSignature
  | ExperimentsIdDataPostSignature;
type ExperimentsIdCache =
  | ExperimentsIdCacheGetSignature
  | ExperimentsIdCacheDeleteSignature;

type Directories = DirectoriesGetSignature | DirectoriesPostSignature;
type DirectoriesId =
  | DirectoriesIdPutSignature
  | DirectoriesIdGetSignature
  | DirectoriesIdDeleteSignature;
type DirectoriesIdChildren = DirectoriesIdChildrenGetSignature;
