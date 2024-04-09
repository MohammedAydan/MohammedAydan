import { createContext, useEffect, useState } from "react";

export const reposContext = createContext(null);

export const ReposProvider = ({ children }) => {
  const [repos, setRepos] = useState(null); // Initialize user state with null
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  useEffect(() => {
    getReposByCash();
    getRepos();
  }, []);

  const setLoading = () => {
    if (!repos || Object.keys(repos).length === 0) {
      setIsLoadingRepos(true);
    }
  };

  const getReposByCash = () => {
    const _respos = localStorage.getItem("reposData");
    setRepos(JSON.parse(_respos));
  };

  const storeReposForCash = (_repos) => {
    localStorage.setItem("reposData", JSON.stringify(_repos));
  };

  const getRepos = async () => {
    try {
      setLoading();
      const response = await fetch(
        "https://api.github.com/users/MohammedAydan/repos"
      );

      const data = await response.json();
      storeReposForCash(data);
      setRepos(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const value = {
    isLoadingRepos,
    repos,
  };

  return <reposContext.Provider value={value}>{children}</reposContext.Provider>;
};
