import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).default("用户"),
  age: integer().notNull().default(0),
  email: varchar({ length: 255 }).unique(),
  passWord:varchar({length:255}).notNull(),
  phoneNumber:varchar({length:11}).notNull().unique(),
  createdAt:timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export type User = typeof users.$inferSelect; // 查询返回类型