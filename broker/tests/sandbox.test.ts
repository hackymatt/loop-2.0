import { expect } from "chai";
import { getSandboxName, getSandboxImage } from "../src/sandbox";
import { TAG } from "../src/const";

describe("runner.ts", function () {
  describe("getSandboxName", function () {
    it("should return the correct runner name for python", function () {
      const result = getSandboxName("python");
      expect(result).to.equal("python-sandbox");
    });
  });

  describe("getSandboxImage", function () {
    it("should return the correct runner image with the tag", function () {
      const result = getSandboxImage("python");
      expect(result).to.equal(`loopedupl/python-sandbox:${TAG}`);
    });
  });
});
