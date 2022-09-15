import { Octokit } from "octokit";

const http = new Octokit({ auth: process.env.GHOPS_TOKEN });

export { http };
