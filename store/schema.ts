// Store schema definitions using centralized types
import { z } from 'zod';
import type { User, Chain, TimelockContract, AuthState } from '@/types';

// 定义用户数据结构
export const UserSchema = z.object({
  id: z.string().uuid('无效的用户ID格式'),
  name: z.string().min(2, '用户名至少需要2个字符'),
  email: z.string().email('无效的邮箱格式'),
  walletAddress: z.string().optional(),
});

export const ChainSchema = z.object({
  id: z.number(),
  chain_id: z.number(),
  chain_name: z.string(),
  created_at: z.string(),
  display_name: z.string(),
  is_active: z.boolean(),
  is_testnet: z.boolean(),
  logo_url: z.string(),
  native_token: z.string(),
  updated_at: z.string(),
});

export const TimelockContractSchema = z.object({
  id: z.number(),
  chain_name: z.string(),
  contract_address: z.string(),
  admin: z.string().optional(),
  created_at: z.string(),
  remark: z.string(),
  status: z.string(),
  standard: z.enum(['compound', 'openzeppelin']),
  // OpenZeppelin specific fields
  proposers: z.string().optional(),
  executors: z.string().optional(),
  cancellers: z.string().optional(),
  // Compound specific fields
  pending_admin: z.string().optional(),
});

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

// Export inferred types (these should match the centralized types)
export type { User, Chain };
export type TimelockContractItem = z.infer<typeof TimelockContractSchema>;
export type AppState = z.infer<typeof AppStateSchema>;
