import { StateCreator } from "zustand";
import {
  UsersGetSignature,
  UsersPostSignature,
} from "../../../../pages/api/v2/users";
import {
  UsersIdDeleteSignature,
  UsersIdGetSignature,
  UsersIdPutSignature,
} from "../../../../pages/api/v2/users/[id]";
import { UserJson } from "../../../common/types/models";
import { fetcher } from "../../fetcher";

export type UserSlice = {
  userMap: Record<string, UserJson>;
  updateUser: (
    id: string,
    update: UsersIdPutSignature["body"]
  ) => Promise<void>;
  createUser: (body: UsersPostSignature["body"]) => Promise<UserJson>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => Promise<void>;
  getUsers: () => Promise<void>;
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  userMap: {},
  deleteUser: async (id) => {
    const { [id]: original, ...rest } = get().userMap;

    set({ userMap: rest });

    try {
      await fetcher<UsersIdDeleteSignature>({
        url: "/api/v2/users/[id]",
        method: "DELETE",
        query: {
          id,
        },
      });
    } catch {
      set((state) => ({ userMap: { ...state.userMap, [id]: original } }));
    }
  },
  createUser: async (body) => {
    const user = await fetcher<UsersPostSignature>({
      body,
      url: "/api/v2/users",
      method: "POST",
    });
    set((state) => ({ userMap: { ...state.userMap, [user._id]: user } }));
    return user;
  },
  updateUser: async (id, update) => {
    const original = get().userMap[id];

    const optimistic = { ...original, ...update };

    set((state) => ({ userMap: { ...state.userMap, [id]: optimistic } }));

    try {
      const user = await fetcher<UsersIdPutSignature>({
        url: "/api/v2/users/[id]",
        method: "PUT",
        query: {
          id,
        },
        body: update,
      });
      set((state) => ({ userMap: { ...state.userMap, [id]: user } }));
    } catch {
      set((state) => ({ userMap: { ...state.userMap, [id]: original } }));
    }
  },
  getUser: async (id) => {
    const user = await fetcher<UsersIdGetSignature>({
      url: "/api/v2/users/[id]",
      method: "GET",
      query: {
        id,
      },
    });

    set((state) => ({ userMap: { ...state.userMap, [id]: user } }));
  },
  getUsers: async () => {
    const users = await fetcher<UsersGetSignature>({
      method: "GET",
      url: "/api/v2/users",
    });

    set({
      userMap: Object.fromEntries(users.map((user) => [user._id, user])),
    });
  },
});
