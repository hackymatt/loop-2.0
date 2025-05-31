import { expect } from "chai";
import proxyquire from "proxyquire";

describe("const.ts", () => {
  const OLD_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should load default values when env vars are not set", () => {
    delete process.env.API_PORT;
    delete process.env.WS_PORT;
    delete process.env.RABBITMQ_HOST;
    delete process.env.RABBITMQ_PORT;
    delete process.env.RABBITMQ_USER;
    delete process.env.RABBITMQ_PASSWORD;
    delete process.env.TAG;
    delete process.env.JWT_SECRET;
    delete process.env.OPENAI_API_KEY;

    const config = proxyquire("../src/const", {
      dotenv: { config: () => {} },
    });

    expect(config.API_PORT).to.equal(4000);
    expect(config.WS_PORT).to.equal(8080);
    expect(config.RABBITMQ_HOST).to.equal("localhost");
    expect(config.RABBITMQ_PORT).to.equal("5672");
    expect(config.RABBITMQ_USER).to.equal("user");
    expect(config.RABBITMQ_PASSWORD).to.equal("password");
    expect(config.RABBITMQ_URL).to.equal("amqp://user:password@localhost:5672");
    expect(config.TAG).to.equal("latest");
    expect(config.JWT_SECRET).to.equal(
      "lmzpsXgy4NGIUuO9MbkM9lS0dJkSSMehjyKS529EACLg8AT6C5U42T9hl5s19ZLbUw7HZwSVVRPKWqbxvboTOQ=="
    );
    expect(config.OPENAI_API_KEY).to.equal("placeholder");
  });

  it("should use values from environment variables", () => {
    process.env.API_PORT = "4000";
    process.env.WS_PORT = "4040";
    process.env.RABBITMQ_HOST = "rabbitmq";
    process.env.RABBITMQ_PORT = "1234";
    process.env.RABBITMQ_USER = "admin";
    process.env.RABBITMQ_PASSWORD = "secret";
    process.env.TAG = "dev";
    process.env.JWT_SECRET = "secret";
    process.env.OPENAI_API_KEY = "secret";

    const config = proxyquire("../src/const", {
      dotenv: { config: () => {} },
    });

    expect(config.API_PORT).to.equal(4000);
    expect(config.WS_PORT).to.equal(4040);
    expect(config.RABBITMQ_HOST).to.equal("rabbitmq");
    expect(config.RABBITMQ_PORT).to.equal("1234");
    expect(config.RABBITMQ_USER).to.equal("admin");
    expect(config.RABBITMQ_PASSWORD).to.equal("secret");
    expect(config.RABBITMQ_URL).to.equal("amqp://admin:secret@rabbitmq:1234");
    expect(config.TAG).to.equal("dev");
    expect(config.JWT_SECRET).to.equal("secret");
    expect(config.OPENAI_API_KEY).to.equal("secret");
  });
});
