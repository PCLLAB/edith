import { StateCreator } from "zustand";
import { GetUsers, PostUsers } from "../../../../pages/api/v2/users";
import { GetUsersAuth } from "../../../../pages/api/v2/users/auth";
import {
  DeleteUsersId,
  GetUsersId,
  PutUsersId,
} from "../../../../pages/api/v2/users/[id]";
import { UserJson } from "../../../common/types/models";
import { fetcher } from "../../fetcher";

export type UserSlice = {
  userMap: Record<string, UserJson>;
  updateUser: (id: string, update: PutUsersId["body"]) => Promise<UserJson>;
  createUser: (body: PostUsers["body"]) => Promise<UserJson>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => Promise<void>;
  getMe: () => Promise<UserJson>;
  getUsers: () => Promise<void>;
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  userMap: {},
  deleteUser: async (id) => {
    const { [id]: original, ...rest } = get().userMap;

    set({ userMap: rest });

    try {
      await fetcher<DeleteUsersId>({
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
    const user = await fetcher<PostUsers>({
      body,
      url: "/api/v2/users",
      method: "POST",
    });
    set((state) => ({ userMap: { ...state.userMap, [user._id]: user } }));
    return user;
  },
  updateUser: async (id, update) => {
    const original = get().userMap[id];

    const { oldPassword: _0, newPassword: _1, ...cleanUpdate } = update;

    const optimistic = { ...original, ...cleanUpdate };

    // set((state) => ({ userMap: { ...state.userMap, [id]: optimistic } }));

    // return original;
    // try {
    const user = await fetcher<PutUsersId>({
      url: "/api/v2/users/[id]",
      method: "PUT",
      query: {
        id,
      },
      body: update,
    });
    set((state) => ({ userMap: { ...state.userMap, [id]: user } }));

    return user;
    // } catch {
    //   set((state) => ({ userMap: { ...state.userMap, [id]: original } }));
    //   throw "Failed to update user";
    // }
  },
  getUser: async (id) => {
    const user = await fetcher<GetUsersId>({
      url: "/api/v2/users/[id]",
      method: "GET",
      query: {
        id,
      },
    });

    set((state) => ({ userMap: { ...state.userMap, [id]: user } }));
  },
  getMe: async () => {
    const me = await fetcher<GetUsersAuth>({
      url: "/api/v2/users/auth",
      method: "GET",
    });
    set((state) => ({ userMap: { ...state.userMap, [me._id]: me } }));
    return me;
  },
  getUsers: async () => {
    const users = await fetcher<GetUsers>({
      method: "GET",
      url: "/api/v2/users",
    });

    set({
      userMap: Object.fromEntries(users.map((user) => [user._id, user])),
    });
  },
});
