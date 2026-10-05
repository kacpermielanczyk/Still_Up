export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  monitors: {
    all: ["monitors"] as const,

    detail: (monitorId: number) =>
      [
        "monitors",
        monitorId,
      ] as const,

    checks: (
      monitorId: number,
      limit: number,
    ) =>
      [
        "monitors",
        monitorId,
        "checks",
        limit,
      ] as const,

    incidents: (
      monitorId: number,
      limit: number,
    ) =>
      [
        "monitors",
        monitorId,
        "incidents",
        limit,
      ] as const,

    stats: (
      monitorId: number,
      period: string,
    ) =>
      [
        "monitors",
        monitorId,
        "stats",
        period,
      ] as const,
  },

  health: ["health"] as const,
};
