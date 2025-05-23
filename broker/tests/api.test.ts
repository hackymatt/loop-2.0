import express from "express";
import request from "supertest";
import sinon from "sinon";
import { expect } from "chai";
import router from "../src/api";

const app = express();
app.use(express.json());
app.use(router);

describe("api.ts", () => {
  let createUserPodStub: sinon.SinonStub;
  let publishStub: sinon.SinonStub;

  beforeEach(() => {
    createUserPodStub = sinon.stub(require("../src/k8s"), "createUserPod");
    publishStub = sinon.stub(require("../src/message-queue/publisher"), "publish");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/test").send({ user_id: "123", technology: "nodejs" }); // Missing files and command

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Missing required fields: user_id, files, timeout or command");
  });

  it("should return 500 on internal server error", async () => {
    // Simulating an error in createUserPod
    createUserPodStub.rejects(new Error("Internal error"));

    const res = await request(app)
      .post("/test")
      .send({
        user_id: "123",
        technology: "nodejs",
        files: ["file1", "file2"],
        timeout: 10,
        command: "deploy",
      });

    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal("Internal server error");
  });

  it("should return 200 on successful job result", async () => {
    // Stubbing successful resolution for both functions
    createUserPodStub.resolves();
    publishStub.resolves({ success: true });

    const res = await request(app)
      .post("/test")
      .send({
        user_id: "123",
        technology: "nodejs",
        files: ["file1", "file2"],
        timeout: 10,
        command: "deploy",
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
  });

  it("should return 400 if job result contains error", async () => {
    // Stubbing an error response for publish
    createUserPodStub.resolves();
    publishStub.resolves({ error: "Something went wrong" });

    const res = await request(app)
      .post("/test")
      .send({
        user_id: "123",
        technology: "nodejs",
        files: ["file1", "file2"],
        timeout: 10,
        command: "deploy",
      });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Something went wrong");
  });
});
