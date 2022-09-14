import { Octokit } from "octokit";

const http = new Octokit({ auth: process.env.GITHUB_TOKEN });

export { http };
