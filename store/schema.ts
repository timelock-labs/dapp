// src/store/schema.ts
import { z } from 'zod';

// 定义用户数据结构
export const UserSchema = z.object({
  id: z.string().uuid('无效的用户ID格式'),
  name: z.string().min(2, '用户名至少需要2个字符'),
  email: z.string().email('无效的邮箱格式'),
});

// 定义 Store 的状态（State）部分
// 注意：我们只对数据进行校验，actions (方法) 不需要包含在内
export type User = z.infer<typeof UserSchema>;

export const ChainSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type Chain = z.infer<typeof ChainSchema>;

export const AppStateSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  expiresAt: z.number().nullable(),
  chains: z.array(ChainSchema),
  _hasHydrated: z.boolean(),
});

export type AppState = z.infer<typeof AppStateSchema>;

// 使用 z.infer 从 schema 中推断出 TypeScript 类型
export type User = z.infer<typeof UserSchema>;
export type AppState = z.infer<typeof AppStateSchema>;
