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

// export type ApiTypeToData<T> =
//   T extends `${UsersGetSignature["method"]} ${UsersGetSignature["url"]}`
//     ? UsersGetSignature["data"]
//     : T extends `${UsersPostSignature["method"]} ${UsersPostSignature["url"]}`
//     ? UsersPostSignature["data"]
//     : T extends `${UsersAuthPostSignature["method"]} ${UsersAuthPostSignature["url"]}`
//     ? UsersAuthPostSignature["data"]
//     : T extends `${UsersIdGetSignature["method"]} ${UsersIdGetSignature["url"]}`
//     ? UsersIdGetSignature["data"]
//     : T extends `${UsersIdPutSignature["method"]} ${UsersIdPutSignature["url"]}`
//     ? UsersIdPutSignature["data"]
//     : T extends `${UsersIdDeleteSignature["method"]} ${UsersIdDeleteSignature["url"]}`
//     ? UsersIdDeleteSignature["data"]
//     : T extends `${ExperimentsGetSignature["method"]} ${ExperimentsGetSignature["url"]}`
//     ? ExperimentsGetSignature["data"]
//     : T extends `${ExperimentsPostSignature["method"]} ${ExperimentsPostSignature["url"]}`
//     ? ExperimentsPostSignature["data"]
//     : T extends `${ExperimentsIdPostSignature["method"]} ${ExperimentsIdPostSignature["url"]}`
//     ? ExperimentsIdPostSignature["data"]
//     : T extends `${ExperimentsIdPutSignature["method"]} ${ExperimentsIdPutSignature["url"]}`
//     ? ExperimentsIdPutSignature["data"]
//     : T extends `${ExperimentsIdDeleteSignature["method"]} ${ExperimentsIdDeleteSignature["url"]}`
//     ? ExperimentsIdDeleteSignature["data"]
//     : T extends `${ExperimentsIdDataGetSignature["method"]} ${ExperimentsIdDataGetSignature["url"]}`
//     ? ExperimentsIdDataGetSignature["data"]
//     : T extends `${ExperimentsIdDataPostSignature["method"]} ${ExperimentsIdDataPostSignature["url"]}`
//     ? ExperimentsIdDataPostSignature["data"]
//     : T extends `${ExperimentsIdCacheGetSignature["method"]} ${ExperimentsIdCacheGetSignature["url"]}`
//     ? ExperimentsIdCacheGetSignature["data"]
//     : T extends `${ExperimentsIdCacheDeleteSignature["method"]} ${ExperimentsIdCacheDeleteSignature["url"]}`
//     ? ExperimentsIdCacheDeleteSignature["data"]
//     : T extends `${DirectoriesGetSignature["method"]} ${DirectoriesGetSignature["url"]}`
//     ? DirectoriesGetSignature["data"]
//     : T extends `${DirectoriesPostSignature["method"]} ${DirectoriesPostSignature["url"]}`
//     ? DirectoriesPostSignature["data"]
//     : T extends `${DirectoriesIdPutSignature["method"]} ${DirectoriesIdPutSignature["url"]}`
//     ? DirectoriesIdPutSignature["data"]
//     : T extends `${DirectoriesIdGetSignature["method"]} ${DirectoriesIdGetSignature["url"]}`
//     ? DirectoriesIdGetSignature["data"]
//     : T extends `${DirectoriesIdDeleteSignature["method"]} ${DirectoriesIdDeleteSignature["url"]}`
//     ? DirectoriesIdDeleteSignature["data"]
//     : T extends `${DirectoriesIdChildrenGetSignature["method"]} ${DirectoriesIdChildrenGetSignature["url"]}`
//     ? DirectoriesIdChildrenGetSignature["data"]
//     : never;

// type Expressionify<T extends ApiSignature> = T extends ApiSignature
//   ? `${T["method"]} ${T["url"]}`
//   : never;

// type ApplyApiSignatureType<T extends ApiSignature> = T extends ApiSignature
//   ? T & { type: Expressionify<T> }
//   : never;

// export type TypedApiSignature = ApplyApiSignatureType<ApiSignature>;
