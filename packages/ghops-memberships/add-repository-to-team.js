import { http, config, Op } from "@my-devops-playground/ghops-core";

/**
 * Operation that adds a repository to a team
 *
 * @see https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions
 */
export default class AddRepositoryToTeamOp extends Op {
  constructor() {
    super("memberships/add-repository-to-team");
  }

  async execute() {
    this.logger.info({ step: "start" });

    await Promise.all(
      config.teams.map(async (team) => await this.#processTeam(team))
    );

    this.logger.info({ step: "finish" });
  }

  async #processTeam(teamSection) {
    const [org, team_slug] = teamSection.name.split("/");

    return teamSection.repositories.map(async ({ name, permission }) => {
      this.logger.info({ step: "repo-info" });
      const repo = await this.#getRepositoryByNameAndOwner(name, org);

      this.logger.info({ step: "team-info" });
      const team = await this.#getTeamByOrgAndSlugName(org, team_slug);

      this.logger.info({ step: "repo-update" });
      return await this.#updateRepoPermissions({
        repo,
        team,
        permission,
      });
    });
  }

  /**
   * @see https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions
   */
  async #updateRepoPermissions({ repo, team, permission }) {
    return http.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org: repo.organization.login,
      team_slug: team.slug,
      permission,
      owner: repo.owner.login,
      repo: repo.name,
    });
  }

  /**
   * @see https://docs.github.com/en/rest/teams/teams#get-a-team-by-name
   */
  async #getTeamByOrgAndSlugName(org, team_slug) {
    return http.rest.teams
      .getByName({ org, team_slug })
      .then((res) => res.data);
  }

  /**
   * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
   */
  async #getRepositoryByNameAndOwner(repo, owner) {
    return http.rest.repos.get({ repo, owner }).then((resp) => resp.data);
  }
}
