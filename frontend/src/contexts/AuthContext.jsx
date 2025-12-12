import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/portal/login");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData && userData.is_active && userData.can_access_system) {
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password, role = null) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password, role);

      if (!response || !response.token || !response.user) {
        throw new Error("Invalid response from server");
      }

      const { token: newToken, user: userData } = response;

      if (!userData.is_active || !userData.can_access_system) {
        throw new Error(
          "Your account is inactive. Please contact administrator."
        );
      }

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);

      // Redirect based on role
      const roleRoutes = {
        admin: "/admin",
        doctor: "/doctor",
        patient: "/patient",
        staff: "/staff",
        hr: "/staff",
      };

      const route = roleRoutes[userData.role] || "/portal";
      navigate(route);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
