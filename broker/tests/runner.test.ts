import { expect } from "chai";
import { getRunnerName, getRunnerImage } from "../src/runner";
import { TAG } from "../src/const";

describe("runner.ts", function () {
  describe("getRunnerName", function () {
    it("should return the correct runner name for python", function () {
      const result = getRunnerName("python");
      expect(result).to.equal("python-runner");
    });
  });

  describe("getRunnerImage", function () {
    it("should return the correct runner image with the tag", function () {
      const result = getRunnerImage("python");
      expect(result).to.equal(`loopedupl/python-runner:${TAG}`);
    });
  });
});
