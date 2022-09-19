import AddRepositoryToTeamOp from "./AddRepositoryToTeamOp.js";
import BranchProtectionOp from "./BranchProtectionOp.js";
import Operation from "./Operation.js";

import { reduceAsyncSeq } from "@my-devops-playground/ghops-core";

const ALL_OPERATIONS = [AddRepositoryToTeamOp, BranchProtectionOp];

export default class AllOperations extends Operation {
  constructor(connection) {
    super(connection, "ghops/all");
  }

  execute() {
    reduceAsyncSeq(
      ALL_OPERATIONS,
      async (OpClass) => await new OpClass(this.connection).execute()
    );
  }
}
