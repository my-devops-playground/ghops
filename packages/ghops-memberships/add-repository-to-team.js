import { Op, reduceAsyncSeq } from "@my-devops-playground/ghops-core";

/**
 * Operation that adds a repository to a team
 *
 * @see https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions
 */
export default class AddRepositoryToTeamOp extends Op {
  constructor(connection) {
    super(connection, "memberships/team/repository/add");
  }

  async execute() {
    return reduceAsyncSeq(
      this.config.teams,
      async (team) => await this.#processTeam(team)
    ).then(() => this.logger.info({ step: "finish" }));
  }

  async #processTeam(teamSection) {
    const [org, team_slug] = teamSection.name.split("/");

    return await reduceAsyncSeq(
      teamSection.repositories,
      async ({ name, permission }) => {
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
      }
    );
  }

  /**
   * @see https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions
   */
  async #updateRepoPermissions({ repo, team, permission }) {
    return this.http.rest.teams.addOrUpdateRepoPermissionsInOrg({
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
    return this.http.rest.teams
      .getByName({ org, team_slug })
      .then((res) => res.data);
  }

  /**
   * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
   */
  async #getRepositoryByNameAndOwner(repo, owner) {
    return this.http.rest.repos.get({ repo, owner }).then((resp) => resp.data);
  }
}
