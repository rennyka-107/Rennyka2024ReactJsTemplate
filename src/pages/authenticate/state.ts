import { create } from "zustand";
import { apiGetUserInformation, apiLogin } from "./service";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-toastify";

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
  user: any;
  is_logged: boolean;
  access_token: string | null;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  getUserInformation: () => Promise<{ success: boolean; message: string }>;
}

function renderUser(username: 'vpbank_admin' | 'vpbank_hr' | 'vpbank_it' | string) {
  switch (username) {
    case 'vpbank_admin':
      return {
        name: "Super Admin", role: "admin", faqs: [
          'Hiện công ty có bao nhiêu nhân sự.',
          'Thống kê cho tôi biết số lượng và tỷ lệ nhân sự theo thâm niên: > 10 năm, 5-10 năm, 3-5 năm, 2-3 năm, 1-2 năm, < 1 năm.',
          'Cho tôi biết số lượng và tỷ lệ nhân sự nghỉ việc tự nguyện.',
          'Vẽ cho tôi biểu đồ thể hiện số lượng và tỷ lệ giới tính nhân sự mới được tuyển dụng.'
        ]
      }
    case 'vpbank_hr':
      return {
        name: "Human Resources Admin", role: "hr", faqs: []
      }
    case 'vpbank_it':
      return {
        name: "Information Technology Admin", role: "admin", faqs: []
      }
    default:
      return null;
  }
}

export const useUserStore = create<
  InitialState,
  [["zustand/persist", { access_token, is_logged }]]
>(
  persist(
    (set) => ({
      user: null,
      is_logged: false,
      access_token: null,
      login: async (payload: ILoginRequest) => {
        try {
          // const {
          //   data: { access_token },
          //   status,
          //   message,
          // } = await apiLogin<{
          //   access_token: string;
          // }>(payload);
          // if (status === 200) {
          const user = renderUser(payload.username);
          console.log(user, "uasfasf")
          if (user) {
            set(() => ({
              access_token: "123", is_logged: true, user
            }));
            toast.success("Đăng nhập thành công!")
          } else {
            toast.error("Sai tài khoản hoặc mật khẩu!")
          }


          // }
          return { success: true, message: "Đăng nhập thành công" };
        } catch (err) {
          console.log(err, "Err login");
          return { success: false, message: "Có lỗi xảy ra" };
        }
      },
      getUserInformation: async () => {
        try {
          const {
            data: { user },
            status,
            message,
          } = await apiGetUserInformation<{ user: IUser }>();
          if (status === 200) {
            set(() => ({ user }));
          }
          return { success: true, message };
        } catch (err) {
          console.log(err, "Err get user information");
          return { success: false, message: "Có lỗi xảy ra" };
        }
      },
    }),
    {
      name: "auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ...state }),
    }
  )
);
