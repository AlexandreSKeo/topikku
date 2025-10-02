import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Generic auth provider fields
    authProviderId: v.string(), // External auth provider's user ID
    authProvider: v.string(), // e.g., "workos", "auth0", "clerk", etc.

    // User profile
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    lastLoginAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_auth_provider", ["authProvider", "authProviderId"])
    .index("by_email", ["email"]),

  topics: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_created_by", ["createdBy"])
    .index("by_created_at", ["createdAt"]),

  questions: defineTable({
    topicId: v.id("topics"),
    questionText: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_topic", ["topicId"])
    .index("by_created_by", ["createdBy"])
    .index("by_topic_and_created_at", ["topicId", "createdAt"]),
});
