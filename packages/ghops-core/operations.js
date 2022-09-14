/**
 * Represents an operation. And operation has a plan and
 * the operation can eventually execute that plan
 */
class Op {
  /**
   * This method should be executed to know which actions
   * will be finally executed. Some actions could have
   * been already taken and we may not want to execute them
   * again
   *
   * Besides the user could only want to do a dry-run and
   * see what would have been the outcome in case it may
   * have been run
   */
  plan() {
    throw new Error("operation not supported!");
  }

  /**
   * This method applies all changes included in the operation
   * plan
   */
  execute() {
    throw new Error("operation not supported!");
  }
}

export { Op };
