import React, { useContext } from "react";
import RepoCard from "../RepoCard/RepoCard";
import { reposContext } from "../../contexts/ReposContext/ReposContext";

function ContainerRepos() {
  const { isLoadingRepos, repos } = useContext(reposContext);

  if (isLoadingRepos) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <div className="w-11 h-11 rounded-full border-8 border-white border-r-transparent animate-spin"></div>
      </div>
    );
  }

  if (!repos || Object.keys(repos).length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="font-bold">404 || REPOS NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="container-repos">
      {Object.values(repos).map((repo) => {
        return <RepoCard repoData={repo} />;
      })}
    </div>
  );
}

export default ContainerRepos;
