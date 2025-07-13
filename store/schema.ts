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
  chain_id: z.number(),
  chain_name: z.string(),
  created_at: z.string(),
  display_name: z.string(),
  id: z.number(),
  is_active: z.boolean(),
  is_testnet: z.boolean(),
  logo_url: z.string(),
  native_token: z.string(),
  updated_at: z.string(),
});

export type Chain = z.infer<typeof ChainSchema>;

export const TimelockContractSchema = z.object({
  id: z.number(),
  chain_name: z.string(),
  contract_address: z.string(),
  admin: z.string(),
  created_at: z.string(),
  remark: z.string(),
  status: z.string(),
});

export type TimelockContract = z.infer<typeof TimelockContractSchema>;

export const AppStateSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  expiresAt: z.number().nullable(),
  chains: z.array(ChainSchema),
  allTimelocks: z.array(TimelockContractSchema),
  _hasHydrated: z.boolean(),
});

export type AppState = z.infer<typeof AppStateSchema>;
