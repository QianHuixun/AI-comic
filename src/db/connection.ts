import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();
// 1. 初始化 Postgres 客户端（Drizzle 用）
const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }, // Supabase 需开启 SSL
  max: 10, // 连接池大小
  prepare: false, // Supabase pooler/pgbouncer 下禁用 prepared statements
});

// 2. 初始化 Drizzle ORM 实例
export const db = drizzle(sql);

// 3. 可选：初始化 Supabase 客户端（用于 Auth/Storage 等 Supabase 特有功能）
// export const supabase = createClient(
//   process.env.SUPABASE_URL!, // Supabase URL（控制台复制）
//   process.env.SUPABASE_ANON_KEY! // Supabase anon key（控制台复制）
// );

// 验证数据库连接
export const testDbConnection = async () => {
  try {
    await sql`SELECT 1`; // 测试 Postgres 连接
    console.log("✅ Supabase 数据库连接成功");
  } catch (error) {
    console.error("❌ Supabase 数据库连接失败：", error);
    process.exit(1);
  }
};
