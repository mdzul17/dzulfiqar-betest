const Mongo = require("../mongo");

describe("Mongo", () => {
  it("should throw an error when failed to connect", async () => {
    const mongo = new Mongo();

    await expect(mongo.connect({})).rejects.toThrowError(
      "MONGODB_CONNECTION.FAILED_TO_CONNECT"
    );
  });
});
