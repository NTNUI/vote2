import { membershipDenialReason } from "../controllers/auth";

const contract = (start_date: string | null, expiry_date: string | null) => ({
  start_date,
  expiry_date,
});

const NO_MEMBERSHIP = "No active NTNUI membership found for the given user";
const TOO_NEW = "NTNUI membership has not been valid for 30 days";

describe("membershipDenialReason", () => {
  const today = "2026-09-22";

  test("rejects users without contracts", () => {
    expect(membershipDenialReason([], today)).toBe(NO_MEMBERSHIP);
    expect(membershipDenialReason(undefined, today)).toBe(NO_MEMBERSHIP);
  });

  test("ignores null contract entries", () => {
    expect(membershipDenialReason([null], today)).toBe(NO_MEMBERSHIP);
    expect(
      membershipDenialReason(
        [null, contract("2025-08-01", "2026-09-23")],
        today
      )
    ).toBeNull();
  });

  test("rejects expired memberships", () => {
    expect(
      membershipDenialReason([contract("2025-08-01", "2026-09-21")], today)
    ).toBe(NO_MEMBERSHIP);
  });

  test("rejects memberships that have not started yet", () => {
    expect(
      membershipDenialReason([contract("2026-09-23", "2027-09-23")], today)
    ).toBe(NO_MEMBERSHIP);
  });

  test("accepts memberships expiring today", () => {
    expect(
      membershipDenialReason([contract("2025-08-01", "2026-09-22")], today)
    ).toBeNull();
  });

  test("ignores contracts without an expiry date", () => {
    expect(membershipDenialReason([contract("2026-08-01", null)], today)).toBe(
      NO_MEMBERSHIP
    );
  });

  test("ignores contracts without a start date", () => {
    expect(membershipDenialReason([contract(null, "2026-12-31")], today)).toBe(
      NO_MEMBERSHIP
    );
  });

  test("accepts memberships active for 30 days", () => {
    expect(
      membershipDenialReason([contract("2026-08-23", "2027-08-23")], today)
    ).toBeNull();
  });

  test("rejects memberships active for less than 30 days", () => {
    expect(
      membershipDenialReason([contract("2026-08-24", "2027-08-24")], today)
    ).toBe(TOO_NEW);
  });

  test("counts 30 days across month boundaries", () => {
    expect(
      membershipDenialReason(
        [contract("2026-07-01", "2026-12-31")],
        "2026-07-31"
      )
    ).toBeNull();
    expect(
      membershipDenialReason(
        [contract("2026-07-02", "2026-12-31")],
        "2026-07-31"
      )
    ).toBe(TOO_NEW);
  });

  test("accepts renewed memberships that together cover the last 30 days", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-06-15", "2026-09-01"),
          contract("2026-09-02", "2027-09-02"),
        ],
        today
      )
    ).toBeNull();
  });

  test("accepts renewed memberships regardless of contract order", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-09-02", "2027-09-02"),
          contract("2026-06-15", "2026-09-01"),
        ],
        today
      )
    ).toBeNull();
  });

  test("merges contracts contained within other contracts", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-01-01", "2026-12-31"),
          contract("2026-03-01", "2026-04-01"),
          contract("2026-09-01", "2026-10-01"),
        ],
        today
      )
    ).toBeNull();
  });

  test("merges a chain of overlapping renewals", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-09-10", "2027-09-10"),
          contract("2026-08-01", "2026-08-20"),
          contract("2026-08-15", "2026-09-10"),
        ],
        today
      )
    ).toBeNull();
  });

  test("rejects memberships with a gap in the last 30 days", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-06-15", "2026-09-01"),
          contract("2026-09-03", "2027-09-03"),
        ],
        today
      )
    ).toBe(TOO_NEW);
  });

  test("accepts new memberships if a contract was valid on the cutoff date", () => {
    expect(
      membershipDenialReason(
        [
          contract("2025-06-01", "2026-06-15"),
          contract("2026-09-10", "2027-09-10"),
        ],
        today,
        true
      )
    ).toBeNull();
  });

  test("accepts contracts expiring on the cutoff date", () => {
    expect(
      membershipDenialReason(
        [
          contract("2025-06-01", "2026-06-01"),
          contract("2026-09-10", "2027-09-10"),
        ],
        today,
        true
      )
    ).toBeNull();
  });

  test("accepts contracts starting on the cutoff date", () => {
    expect(
      membershipDenialReason(
        [
          contract("2026-06-01", "2026-07-01"),
          contract("2026-09-10", "2027-09-10"),
        ],
        today,
        true
      )
    ).toBeNull();
  });

  test("rejects contracts only valid around, but not on, the cutoff date", () => {
    expect(
      membershipDenialReason(
        [
          contract("2025-05-31", "2026-05-31"),
          contract("2026-06-02", "2026-07-01"),
          contract("2026-09-10", "2027-09-10"),
        ],
        today,
        true
      )
    ).toBe(TOO_NEW);
  });

  test("still requires a current membership when valid on the cutoff date", () => {
    expect(
      membershipDenialReason(
        [contract("2025-06-01", "2026-09-01")],
        today,
        true
      )
    ).toBe(NO_MEMBERSHIP);
  });

  describe("with the cutoff date check disabled", () => {
    const cutoffContracts = [
      contract("2025-06-01", "2026-06-15"),
      contract("2026-09-10", "2027-09-10"),
    ];

    test("rejects new memberships valid on the cutoff date", () => {
      expect(membershipDenialReason(cutoffContracts, today, false)).toBe(
        TOO_NEW
      );
    });

    test("still accepts memberships active for 30 days", () => {
      expect(
        membershipDenialReason(
          [contract("2026-08-23", "2026-12-31")],
          today,
          false
        )
      ).toBeNull();
    });

    test("still rejects expired memberships", () => {
      expect(
        membershipDenialReason(
          [contract("2025-06-01", "2026-09-01")],
          today,
          false
        )
      ).toBe(NO_MEMBERSHIP);
    });
  });

  describe("DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK", () => {
    const originalValue = process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK;
    const cutoffContracts = [
      contract("2025-06-01", "2026-06-15"),
      contract("2026-09-10", "2027-09-10"),
    ];

    afterEach(() => {
      if (originalValue === undefined) {
        delete process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK;
      } else {
        process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK = originalValue;
      }
    });

    test("enables the cutoff date check when unset", () => {
      delete process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK;
      expect(membershipDenialReason(cutoffContracts, today)).toBeNull();
    });

    test("enables the cutoff date check when set to anything else", () => {
      process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK = "false";
      expect(membershipDenialReason(cutoffContracts, today)).toBeNull();
    });

    test("disables the cutoff date check when set to true", () => {
      process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK = "true";
      expect(membershipDenialReason(cutoffContracts, today)).toBe(TOO_NEW);
    });
  });
});
