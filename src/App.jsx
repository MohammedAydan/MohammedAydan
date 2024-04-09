import React, { useContext } from "react";
import { userContext } from "./contexts/UserContext/UserContext";
import RepoCard from "./components/RepoCard/RepoCard";
import { reposContext } from "./contexts/ReposContext/ReposContext";
import ContainerRepos from "./components/ContainerRepos/ContainerRepos";
import facebook from "./assets/fb.jpeg";
import linkedin from "./assets/linkedin.jpeg";
import github from "./assets/github.webp";

function App() {
  const { isLoading, user } = useContext(userContext);
  const { isLoadingRepos, repos } = useContext(reposContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-11 h-11 rounded-full border-8 border-white border-r-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="font-bold">404 || USER NOT FOUND</div>
      </div>
    );
  }

  return (
    <div>
      <main className="w-full md:w-11/12 max-w-3xl mx-auto md:p-10">
        <div className="flex flex-col md:flex-row w-full items-center bg-slate-700 md:rounded-xl shadow-lg overflow-hidden pt-5 md:pt-0">
          <div className="img w-56 h-56 min-w-56 rounded-full md:rounded-none overflow-hidden">
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="user-data p-7 w-full min-w-80 flex flex-col justify-center items-center md:ml-10">
            <p className="font-bold text-3xl">{user.login}</p>
            <div className="flex flex-col md:flex-row justify-between p-4 w-full">
              <p className="text-slate-300 text-lg md:text-xl mb-2 md:mb-0">
                Followers: <span className="text-white">{user.followers}</span>
              </p>
              <p className="text-slate-300 text-lg md:text-xl mb-2 md:mb-0">
                Following: <span className="text-white">{user.following}</span>
              </p>
              <p className="text-slate-300 text-lg md:text-xl mb-2 md:mb-0">
                Repos: <span className="text-white">{user.public_repos}</span>
              </p>
            </div>
            <div className="flex flex-row items-center justify-around w-full border-t border-t-slate-500 pt-4">
              <a
                href="https://github.com/MohammedAydan"
                target="_blank"
                className="social-link p-1 bg-white rounded-full overflow-hidden"
                title="Github Profile"
              >
                <img src={github} alt="" className="w-8 h-8" />
              </a>

              <a
                href="https://www.linkedin.com/in/mohamed-aydan-82b2281bb/"
                target="_blank"
                className="social-link p-1 bg-white rounded-full overflow-hidden"
                title="Linkedin Profile"
              >
                <img src={linkedin} alt="" className="w-8 h-8" />
              </a>

              <a
                href="https://www.facebook.com/MohammedAydan"
                target="_blank"
                className="social-link p-1 bg-white rounded-full overflow-hidden"
                title="Facebook Profile"
              >
                <img src={facebook} alt="" className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-5 bg-slate-700 md:rounded-xl shadow-lg overflow-hidden">
          <p className="font-bold text-3xl p-5">Repos</p>
          <ContainerRepos>{/* Content for Repositories */}</ContainerRepos>
        </div>
      </main>
    </div>
  );
}

export default App;
