import React, { useState } from "react";
import img from "../../assets/github.webp";

function RepoCard({ repoData }) {
  const [openMore, setOpenMore] = useState(false);

  const copyLink = (url) => {
    navigator.clipboard.writeText(url).then((v) => {
      alert("Copy link successfull");
    });
  };

  return (
    <div>
      <div className="repo flex flex-row items-center gap-4 p-5 hover:bg-slate-500 transition duration-300 justify-between">
        <a href={repoData.html_url} target="_blank" className="">
          <div className="repo flex flex-row items-center gap-4 cursor-pointer">
            <img
              src={img}
              className="w-16 h-16 rounded-2xl bg-slate-500 p-3"
              alt="github logo"
            />
            <div className="">
              <p>{repoData.name}</p>
              <p className="text-slate-400">{repoData.full_name}</p>
            </div>
          </div>
        </a>
        <div className="">
          <a
            className="text-blue-500 font-bold p-3 rounded-full hover:bg-slate-800 transition duration-300 justify-between cursor-pointer"
            onClick={() => setOpenMore(!openMore)}
          >
            more
          </a>
        </div>
      </div>
      <div
        className={`m-4 rounded-2xl more-data p-3 bg-slate-800 ${
          openMore ? "block" : "hidden"
        } transition-all duration-300`}
      >
        <div className="flex flex-col">
          <a
            className="m-1 p-2 border rounded-xl border-slate-500 cursor-pointer"
            // target="_blank"
            // href={repoData.git_url}
            onClick={() => copyLink(repoData.git_url)}
          >
            Git url:{" "}
            <span className="text-blue-500 font-bold">{repoData.git_url}</span>
          </a>
          <a
            className="m-1 p-2 border rounded-xl border-slate-500 cursor-pointer"
            // target="_blank"
            // href={repoData.ssh_url}
            onClick={() => copyLink(repoData.git_url)}
          >
            Ssh url:{" "}
            <span className="text-blue-500 font-bold">{repoData.ssh_url}</span>
          </a>
          <a
            className="m-1 p-2 border rounded-xl border-slate-500 cursor-pointer"
            // target="_blank"
            // href={repoData.clone_url}
            onClick={() => copyLink(repoData.ssh_url)}
          >
            Clone url:{" "}
            <span className="text-blue-500 font-bold">
              {repoData.clone_url}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
