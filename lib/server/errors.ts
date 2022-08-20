import { HTTP_METHOD } from "../common/types";

export type ModelType =
  | "Directory"
  | "Experiment"
  | "User"
  | "Script"
  | "DataEntry"
  | "CachedDataEntry"
  | "ArchivedExperiment"
  | "Counterbalance";

export class NotAllowedMethodError extends Error {
  methods: HTTP_METHOD[];

  // Method from NextApiRequest is optional string
  constructor(method: string | undefined, methods: HTTP_METHOD[]) {
    super(`${method} method not allowed`);
    this.name = "NotAllowedMethodError";
    this.methods = methods;
  }
}

export class MissingArgsError extends Error {
  constructor(args: string[]) {
    super(`Missing args: ${args}`);
    this.name = "MissingArgsError";
  }
}

export class InvalidArgsError extends Error {
  constructor(args: string[]) {
    super(`Invalid args: ${args}`);
    this.name = "InvalidArgsError";
  }
}

export class ModelNotFoundError extends Error {
  constructor(model: ModelType) {
    super(`Model not found: ${model}`);
    this.name = "ModelNotFoundError";
  }
}

export class UserPermissionError extends Error {
  constructor() {
    super("User does not have permission");
    this.name = "UserPermissionError";
  }
}
