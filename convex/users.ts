import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get or create user based on auth provider
export const upsertUser = mutation({
  args: {
    authProviderId: v.string(),
    authProvider: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth_provider", (q) =>
        q.eq("authProvider", args.authProvider).eq("authProviderId", args.authProviderId)
      )
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        profilePictureUrl: args.profilePictureUrl,
        lastLoginAt: now,
        updatedAt: now,
      });
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      authProviderId: args.authProviderId,
      authProvider: args.authProvider,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      profilePictureUrl: args.profilePictureUrl,
      createdAt: now,
      lastLoginAt: now,
    });
  },
});

// Get user by auth provider ID
export const getUserByAuthId = query({
  args: {
    authProviderId: v.string(),
    authProvider: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_provider", (q) =>
        q.eq("authProvider", args.authProvider).eq("authProviderId", args.authProviderId)
      )
      .first();
  },
});

// Get user by email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get current user (requires auth)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // This will be updated when we add Convex auth
    // For now, we'll need to pass user ID explicitly
    return null;
  },
});
