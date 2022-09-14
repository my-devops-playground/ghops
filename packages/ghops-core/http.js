import { Octokit, App } from "octokit";

const http = new Octokit({ auth: GITHUB_TOKEN || process.env.GITHUB_TOKEN });

export { http };
