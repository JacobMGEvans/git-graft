import { expect, test } from "@oclif/test";

describe("init", () => {
  test
    .stdout()
    .command(["init"])
    .it("runs hello", (ctx) => {
      expect(ctx.stdout).to.contain("hello world");
    });
});
