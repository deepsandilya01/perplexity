import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({ email, username, password });
      return data;
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            "Registration failed",
        ),
      );
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      dispatch(setUser(null));
      dispatch(setError(err.response?.data?.message || "Login failed"));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getMe();
      await wait(400);
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      await wait(400);
      dispatch(setUser(null));
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch user data"),
      );
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
}
