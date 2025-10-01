import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Store auth session from WorkOS (or any provider)
export const storeAuthSession = mutation({
  args: {
    authProviderId: v.string(),
    authProvider: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Upsert the user
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

      return {
        userId: existingUser._id,
        isNewUser: false,
      };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      authProviderId: args.authProviderId,
      authProvider: args.authProvider,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      profilePictureUrl: args.profilePictureUrl,
      createdAt: now,
      lastLoginAt: now,
    });

    return {
      userId,
      isNewUser: true,
    };
  },
});
