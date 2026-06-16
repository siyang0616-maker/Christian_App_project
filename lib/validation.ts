import { z } from "zod";

export const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(30),
});

export const createGroupSchema = z.object({
  name: z.string().trim().min(1).max(40),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().trim().min(4).max(10),
});

const checkboxSchema = z.preprocess((value) => value === "on" || value === "true", z.boolean());

export const checkInSchema = z.object({
  groupId: z.string().uuid(),
  woke_up: checkboxSchema,
  bible_read: checkboxSchema,
  prayed: checkboxSchema,
  meditated: checkboxSchema,
  attended: checkboxSchema,
  mood: z.enum(["good", "normal", "hard", "need_prayer"]),
  note: z.string().trim().max(240).optional(),
  visibility: z.enum(["private", "leader", "group"]),
});

export const prayerRequestSchema = z.object({
  groupId: z.string().uuid(),
  content: z.string().trim().min(1).max(500),
  visibility: z.enum(["private", "leader", "group", "anonymous"]),
});

export const prayerReactionSchema = z.object({
  prayerId: z.string().uuid(),
});
