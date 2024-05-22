const Connections = require("../Connections");

describe("Connections", () => {
  it("should throw an error when invoke abstract behavior", async () => {
    const connections = new Connections();

    await expect(connections.connect()).rejects.toThrowError(
      "CONNECTION.METHOD_NOT_IMPLEMENTED"
    );
  });
});
