import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const { user, loading, error, isAuthenticated, isProUser } =
    storeToRefs(authStore);

  const register = async (payload) => {
    await authStore.register(payload);
    router.push({ name: "Login" });
  };

  const login = async (payload) => {
    await authStore.login(payload);
    router.push({ name: "Dashboard" });
  };

  const logout = async () => {
    await authStore.logout();
    router.push({ name: "Login" });
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isProUser,
    register,
    login,
    logout,
  };
};
