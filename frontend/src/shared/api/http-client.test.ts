import { afterEach, describe, expect, it, vi } from "vitest";
import { request } from "./http-client";
import { ApiError } from "./api-error";

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("request", () => {
  it("Успешный GET возвращает разобранный JSON", async () => {
    const robots = [{ name: "Mule" }];
    const fetchMock = mockFetch(
      new Response(JSON.stringify(robots), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(request("/robots")).resolves.toEqual(robots);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("Статус 404 с JSON-телом бросает ApiError со статусом 404 и телом", async () => {
    const errorBody = { message: "Not found" };
    const fetchMock = mockFetch(
      new Response(JSON.stringify(errorBody), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(request("/robots")).rejects.toMatchObject(
      new ApiError(404, { message: "Not found" }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("Статус 500 с HTML бросает ApiError, а не SyntaxError", async () => {
    const fetchMock = mockFetch(
      new Response("<html>Internal Server Error</html>", {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }),
    );

    await expect(request("/robots")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      body: "<html>Internal Server Error</html>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("Статус 204 при expectNoContent возвращает undefined", async () => {
    const fetchMock = mockFetch(new Response(null, { status: 204 }));

    await expect(
      request("/robots/1", { method: "DELETE", expectNoContent: true }),
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots/1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("Для POST с body клиент должен выставить Content-Type: application/json и передать сериализованное тело", async () => {
    const newRobot = { name: "Mule" };

    const fetchMock = mockFetch(
      new Response(JSON.stringify(newRobot), {
        status: 201,
      }),
    );

    await expect(
      request("/robots", { method: "POST", body: newRobot }),
    ).resolves.toEqual(newRobot);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRobot),
      }),
    );
  });

  it("signal доходит до fetch", async () => {
    const robots = [{ name: "Mule" }];
    const controller = new AbortController();

    const fetchMock = mockFetch(
      new Response(JSON.stringify(robots), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      request("/robots", { signal: controller.signal }),
    ).resolves.toEqual(robots);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/robots"),
      expect.objectContaining({ method: "GET", signal: controller.signal }),
    );
  });
});
