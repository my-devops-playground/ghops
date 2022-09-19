import Operation from "./Operation.js";
import { reduceAsyncSeq } from "@my-devops-playground/ghops-core";

/**
 * Used to update branch protection.
 *
 * @see https://docs.github.com/en/rest/branches/branch-protection#update-branch-protection
 */
export default class BranchProtectionOp extends Operation {
  constructor(connection) {
    super(connection, "branches/protection");
  }

  async execute() {
    this.logger.info({ step: "start" });

    await reduceAsyncSeq(
      this.config.repositories,
      async (repository) => await this.#processRepository(repository)
    );

    this.logger.info({ step: "finish" });
  }

  async #processRepository(repository) {
    this.logger.info({ step: "repo", path: repository.name });
    const [owner, repo] = repository.name.split("/");

    return await reduceAsyncSeq(
      repository.branches,
      async (branch) =>
        await this.#updateBranchProtection({
          owner,
          repo,
          branch,
        })
    );
  }

  async #updateBranchProtection(branchInfo) {
    const { owner, repo, branch } = branchInfo;
    const { name, pull_requests } = branch;
    const branchPath = [owner, repo, name].join("/");

    const response = await this.http.rest.repos.updateBranchProtection({
      owner,
      repo,
      branch: name,
      enforce_admins: true,
      required_status_checks: null,
      dismissal_restrictions: null,
      restrictions: null,
      required_pull_request_reviews: this.#getPullRequestInfo(pull_requests),
    });

    this.logger.info({
      step: "branch",
      result: response.status == "200" ? "success" : "error",
      path: branchPath,
    });

    return response;
  }

  #getPullRequestInfo(pull_requests) {
    return {
      dismiss_stale_reviews: true,
      require_code_owner_reviews: pull_requests.review_codeowners,
      required_approving_review_count: pull_requests.review_count,
    };
  }
}
