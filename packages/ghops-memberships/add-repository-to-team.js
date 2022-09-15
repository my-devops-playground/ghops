import { http, logger, config, Op } from "@my-devops-playground/ghops-core";

/**
 * Operation that adds a repository to a team
 *
 * @see https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions
 */
export default class AddRepositoryToTeamOp extends Op {
  constructor() {
    super();
    this.logger = logger.group({
      action: "memberships/add-repository-to-team",
    });
  }

  execute() {
    this.logger.info({ step: "start" });
    Promise.all(
      config.teams(async (team) => this.#processRepository(team))
    ).then(() => this.logger({ step: "finish" }));
  }

  #processRepository(teamSection) {
    const { org, team_slug } = teamSection.name.split("/");

    teamSection.repositories.map(async (repo) => {
      const project_id = await this.#getRepositoryByName(org, repo.name).then(
        (data) => data.id
      );

      http.rest.actions.addOrUpdateRepoPermissionsInOrg({
        org,
        project_id,
        team_slug,
        permission: repo.permission,
      });
    });
  }

  /**
   * @see https://docs.github.com/en/rest/teams/teams#get-a-team-by-name
   */
  async #getTeamSlugByName(teamName) {
    return http.rest.teams
      .getByName(teamName)
      .then((resp) => resp.data)
      .then((team) => team.slug);
  }

  /**
   * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
   */
  async #getRepositoryByName(repo, owner) {
    return http.rest.repos.get({ repo, owner }).then((resp) => resp.data);
  }
}
