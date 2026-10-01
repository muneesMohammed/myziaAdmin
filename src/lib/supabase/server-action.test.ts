jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    get: jest.fn(() => undefined),
  })),
}));

describe("createServerActionClient", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "prod-1", name: "Test Product" }),
      text: async () => "",
    });
    global.fetch = fetchMock as typeof fetch;
  });

  it("keeps insert().select() as a POST request with a JSON body", async () => {
    const { createServerActionClient } = await import("./server-action");
    const client = createServerActionClient();

    await client.from("products").insert({ name: "Test Product" }).select().single();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, requestInit] = fetchMock.mock.calls[0];
    expect(requestInit).toMatchObject({
      method: "POST",
      body: JSON.stringify({ name: "Test Product" }),
    });
  });

  it("handles bulk in() selection and deletion by iterating over each ID", async () => {
    const { createServerActionClient } = await import("./server-action");
    const client = createServerActionClient();

    await client.from("products").select("image_url").in("id", ["p1", "p2"]);
    await client.from("products").delete().in("id", ["p1", "p2"]);

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls.map(([url, init]) => [url, init?.method])).toEqual([
      ["http://127.0.0.1:8000/api/v1/products/p1", "GET"],
      ["http://127.0.0.1:8000/api/v1/products/p2", "GET"],
      ["http://127.0.0.1:8000/api/v1/products/p1", "DELETE"],
      ["http://127.0.0.1:8000/api/v1/products/p2", "DELETE"],
    ]);
  });
});
