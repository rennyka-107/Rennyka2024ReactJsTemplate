import { create } from "zustand";
import { apiLogin } from "./service";
import { persist, createJSONStorage } from 'zustand/middleware'


export interface IUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  is_superadmin: boolean;
  count_login: number;
}

export interface ILoginRequest {
  username: string;
  password: string;
}
export interface InitialState {
  user: IUser | null;
  is_logged: boolean;
  access_token: string | null;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
}

export const useUserStore = create<InitialState, [["zustand/persist", InitialState]]>(
  persist(
    (set) => ({
        user: null,
        is_logged: false,
        access_token: null,
        login: async (payload: ILoginRequest) => {
          try {
            const {
              data: { access_token },
              status,
              message,
            } = await apiLogin<{
              access_token: string;
            }>(payload);
            if (status === 200) {
              set((state) => ({ access_token, is_logged: true }));
            }
            return { success: true, message };
          } catch (err) {
            console.log(err, "Err");
            return { success: false, message: "Có lỗi xảy ra" };
          }
        }
      }),
      {
        name: "auth_storage",
        storage: createJSONStorage(() => localStorage)
      }
  )
);

