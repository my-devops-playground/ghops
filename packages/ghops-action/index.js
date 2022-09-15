import { Op } from "@my-devops-playground/ghops-core";
import { OPERATIONS as BranchesOps } from "@my-devops-playground/ghops-branches";
import { OPERATIONS as MembershipOps } from "@my-devops-playground/ghops-memberships";

const OPERATIONS = [...MembershipOps, ...BranchesOps];

export default class GhopsAction extends Op {
  constructor() {
    super("ghops/all");
  }

  execute() {
    OPERATIONS.map((OperationClass) => new OperationClass()).forEach((op) =>
      op.execute()
    );
  }
}

new GhopsAction().execute();
