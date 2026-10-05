import {
  useCurrentUser,
} from "./use-current-user";
import {
  useLogin,
} from "./use-login";
import {
  useLogout,
} from "./use-logout";
import {
  useRegister,
} from "./use-register";


export function useAuth() {
  const currentUser = useCurrentUser();
  const login = useLogin();
  const logout = useLogout();
  const register = useRegister();

  return {
    user: currentUser.data ?? null,

    isAuthenticated:
      currentUser.data != null,

    isLoading:
      currentUser.isPending,

    isError:
      currentUser.isError,

    error:
      currentUser.error,

    refetchUser:
      currentUser.refetch,

    login,
    logout,
    register,
  };
}
