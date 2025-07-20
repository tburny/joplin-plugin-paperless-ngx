import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { PaperlessAdapter } from "./PaperlessAdapter";

// This test requires Docker to be installed and running.
// It might take a moment to download the Paperless-ngx image for the first time.
describe("PaperlessAdapter Integration Test", () => {
  let container: StartedTestContainer;
  let paperlessUrl: string;
  let apiToken: string;
  const adminUser = "admin";
  const adminPassword = "adminpassword";

  // Increase Jest's timeout for this test suite because starting a container can be slow.
  jest.setTimeout(90000); // 90 seconds

  beforeAll(async () => {
    // 1. Define the Paperless-ngx container
    const paperlessContainer = new GenericContainer(
      "ghcr.io/paperless-ngx/paperless-ngx:latest"
    )
      .withExposedPorts(8000)
      .withEnvironment({
        PAPERLESS_ADMIN_USER: adminUser,
        PAPERLESS_ADMIN_PASSWORD: adminPassword,
        PAPERLESS_SECRET_KEY: "a-random-secret-key-for-testing",
        PAPERLESS_TIME_ZONE: "UTC",
      })
      .withWaitStrategy(Wait.forHttp("/", 8000).withStartupTimeout(60000));

    // 2. Start the container
    container = await paperlessContainer.start();
    const mappedPort = container.getMappedPort(8000);
    paperlessUrl = `http://localhost:${mappedPort}`;

    // 3. Create an API token for the admin user by executing a command inside the container
    const execResult = await container.exec([
      "python3",
      "manage.py",
      "create_token",
      adminUser,
    ]);

    if (execResult.exitCode !== 0) {
      throw new Error(`Failed to create API token: ${execResult.output}`);
    }
    apiToken = execResult.output.trim();
  });

  afterAll(async () => {
    // 4. Stop the container after all tests are done
    if (container) {
      await container.stop();
    }
  });

  it("sollte sich erfolgreich mit gültigen Zugangsdaten authentifizieren", async () => {
    // Arrange
    const adapter = new PaperlessAdapter();

    // Act
    const result = await adapter.authenticate({
      url: paperlessUrl,
      token: apiToken,
    });

    // Assert
    expect(result.status).toBe("success");
  });

  it("sollte bei einem ungültigen Token einen 'InvalidToken'-Fehler zurückgeben", async () => {
    // Arrange
    const adapter = new PaperlessAdapter();

    // Act
    const result = await adapter.authenticate({
      url: paperlessUrl,
      token: "this-is-a-wrong-token",
    });

    // Assert
    expect(result).toEqual({ status: "error", errorType: "InvalidToken" });
  });

  it("sollte bei einer ungültigen URL einen 'NetworkError' zurückgeben", async () => {
    // Arrange
    const adapter = new PaperlessAdapter();

    // Act
    const result = await adapter.authenticate({
      url: "http://localhost:12345", // A port that is not in use
      token: apiToken,
    });

    // Assert
    expect(result.status).toBe("error");
    expect(result.errorType).toBe("NetworkError");
  });
});

