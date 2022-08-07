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

export type Users = UsersGetSignature | UsersPostSignature;
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

type SignatureBranch<T extends Users> = {
  [url in T["url"]]: {
    [method in (T & { url: url })["method"]]: T & {
      url: url;
      method: method;
    };
  };
};

export type tree2 = {
  [url in Users["url"]]: {
    [method in Users["method"]]: Users & {
      url: url;
      method: method;
    };
  };
} & {
  [url in UsersAuth["url"]]: {
    [method in UsersAuth["method"]]: UsersAuth & {
      url: url;
      method: method;
    };
  };
} & {
  [url in UsersId["url"]]: {
    [method in UsersId["method"]]: UsersId & {
      url: url;
      method: method;
    };
  };
};

export type SignatureTree = SignatureBranch<Users> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<UsersAuth> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<UsersId> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<Experiments> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<ExperimentsId> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<ExperimentsIdData> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<ExperimentsIdCache> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<Directories> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<DirectoriesId> &
  // @ts-ignore: the error doesn't make sense, but the type still works
  SignatureBranch<DirectoriesIdChildren>;
