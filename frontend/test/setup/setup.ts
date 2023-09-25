import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { VoteType } from "../../src/types/votes";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
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

const vote2: VoteType = {
  numberParticipants: 4,
  _id: "1",
  title: "Test",
  voteText: "Testing",
  voted: 2,
  options: [{ _id: "1", title: "Case1", voteCount: 0 }],
  maximumOptions: 1,
  isFinished: false,
  caseNumber: 2,
  isActive: false,
  editable: false,
};
const vote1: VoteType = {
  numberParticipants: 4,
  _id: "2",
  title: "Test2",
  voteText: "Testing2",
  voted: 2,
  options: [{ _id: "2", title: "Case2", voteCount: 0 }],
  maximumOptions: 1,
  isFinished: false,
  caseNumber: 1,
  isActive: false,
  editable: false,
};

const assemblyByName = {
  votes: [vote1, vote2],
  currentVotation: {
    vote1,
  },
  isActive: true,
  participants: [1, 2, 3],
  createdBy: 1,
};

export const restHandlers = [
  rest.get("http://localhost:3000/user/userData", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userData));
  }),
  rest.post("http://localhost:3000/votation/allVotations", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([vote1, vote2]));
  }),
  rest.post("http://localhost:3000/assembly", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(assemblyByName));
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
