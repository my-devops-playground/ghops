import { http, config, logger, Op } from "@my-devops-playground/ghops-core";

/**
 * Used to update branch protection.
 *
 * REST reference at
 * https://docs.github.com/en/rest/branches/branch-protection#update-branch-protection
 *
 */
export default class BranchProtectionOp extends Op {
  constructor() {
    this.logger = logger.child({ action: "branch-protection" });
  }

  async updateBranchProtection(ownerRepoBranchConfig) {
    const { owner, repo, branch } = ownerRepoBranchConfig;

    this.logger.info({
      step: "updating",
      path: [owner, repo, branch].join("/"),
    });

    return http.rest.repos.updateBranchProtection({
      ...ownerRepoBranchConfig,
      enforce_admins: true,
      required_status_checks: null,
      dismissal_restrictions: null,
      restrictions: null,
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 2,
      },
    });
  }

  async execute() {
    this.logger.info({ step: "start" });
    Promise.all(
      config.map(
        async (repository) => await this.#processRepository(repository)
      )
    ).then(() => this.logger.info({ step: "finish" }));
  }

  async #processRepository(repository) {
    this.logger.info({ step: "info", path: repository.name });

    const [owner, repo] = repository.name.split("/");
    const branchProtection = repository["branch-protection"];
    const branch = branchProtection.branch;
    const fullPath = [owner, repo, branch].join("/");

    const response = await this.updateBranchProtection({ owner, repo, branch });

    this.logger.info({
      step: response.status == "200" ? "success" : "error",
      path: fullPath,
    });
  }
}
