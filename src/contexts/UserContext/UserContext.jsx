import { createContext, useEffect, useState } from "react";

export const userContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state with null
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserByCash();
    getUser();
  }, []);

  const setLoading = () => {
    if (!user || Object.keys(user).length === 0) {
      setIsLoading(true);
    }
  };

  const getUserByCash = () => {
    const _user = localStorage.getItem("userData");
    setUser(JSON.parse(_user));
  };

  const storeUserForCash = (_user) => {
    localStorage.setItem("userData", JSON.stringify(_user));
  };

  const getUser = async () => {
    try {
      setLoading();
      const response = await fetch(
        "https://api.github.com/users/MohammedAydan"
      );

      const data = await response.json();
      storeUserForCash(data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    user,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
