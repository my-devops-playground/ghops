import { Op } from "@my-devops-playground/ghops-core";
import { OPERATIONS as BranchesOps } from "@my-devops-playground/ghops-branches";
import { OPERATIONS as MembershipOps } from "@my-devops-playground/ghops-memberships";

const OPERATIONS = [...MembershipOps, ...BranchesOps];

export default class GhopsAction extends Op {
  constructor(connection) {
    super(connection, "ghops/all");
  }

  execute() {
    OPERATIONS.map(
      (OperationClass) => new OperationClass(this.connection)
    ).forEach((op) => op.execute());
  }
}
