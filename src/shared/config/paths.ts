export const PATHS = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CONFIRM: "/auth/confirm",
    ERROR: "/auth/error",
  },
  GUESTHOUSES: {
    LIST: "/guesthouses",
    DETAIL: (guesthouseId: string) => `/guesthouses/${guesthouseId}`,
  },
  SEARCH: "/search",
  WISHLISTS: {
    LIST: "/wishlists",
    DETAIL: (wishlistId: string) => `/wishlists/${wishlistId}`,
  },
  ME: {
    PROFILE: "/me",
    REVIEWS: "/me/reviews",
  },
} as const
