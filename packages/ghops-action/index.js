import { Op } from "@my-devops-playground/ghops-core";
import { OPERATIONS as BranchesOps } from "@my-devops-playground/ghops-branches";
import { OPERATIONS as MembershipOps } from "@my-devops-playground/ghops-memberships";

export default class GhopsAction extends Op {
  execute() {
    const operations = [...MembershipOps, ...BranchesOps];

    operations
      .map((OperationClass) => new OperationClass())
      .array.forEach((op) => op.execute());
  }
}
