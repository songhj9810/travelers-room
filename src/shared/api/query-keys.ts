export const queryKeys = {
  guesthouses: {
    all: ["guesthouses"] as const,
    search: (filter: object) => ["guesthouses", "search", filter] as const,
  },

  reviews: {
    all: ["reviews"] as const,
    byGuesthouse: (guesthouseId: string) =>
      ["reviews", "guesthouse", guesthouseId] as const,
    byGuesthousePage: (guesthouseId: string, page?: number) =>
      ["reviews", "guesthouse", guesthouseId, { page }] as const,
    byUser: () => ["reviews", "user"] as const,
    byUserPage: (page?: number) => ["reviews", "user", { page }] as const,
  },

  wishlists: {
    all: ["wishlists"] as const,
  },

  wishlistItems: {
    all: ["wishlistItems"] as const,
    ids: () => ["wishlistItems", "ids"] as const,
    byWishlist: (wishlistId: string) =>
      ["wishlistItems", "wishlist", wishlistId] as const,
  },
} as const
