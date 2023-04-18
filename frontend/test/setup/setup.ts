import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const userData = {
  firstName: "Ola",
  lastName: "Nordmann",
  groups: [
    {
      groupName: "sprint",
      groupSlug: "Sprint",
      organizer: true,
      hasActiveAssembly: true,
      hasAssemly: true,
      createdBy: "1",
    },
    {
      groupName: "dans",
      groupSlug: "Dans",
      organizer: false,
      hasActiveAssembly: false,
      hasAssemly: false,
      createdBy: "1",
    },
  ],
  isOrganizer: true,
};

export const restHandlers = [
  rest.get("http://localhost:3000/user/userData", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userData));
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
