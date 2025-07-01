// src/store/zodMiddleware.ts
import { type StateCreator } from 'zustand';
import { type ZodType, ZodError } from 'zod';

/**
 * Zustand middleware for Zod validation.
 * It intercepts `set` calls, validates the new state against the schema,
 * and logs detailed errors to the console if validation fails.
 *
 * @template T The type of the store's state.
 * @param schema The Zod schema to validate the state against.
 * @param config The Zustand state creator function.
 * @returns A new state creator with validation logic.
 */
export const zodMiddleware = <T extends object>(
  schema: ZodType<T>,
  config: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, api) => {

  // 创建一个新的 set 函数，包裹原始的 set
  const newSet: typeof set = (partial, replace) => {
    const oldState = get();
    // 计算出下一次的完整状态
    const nextState = {
      ...oldState,
      ...(typeof partial === 'function' ? (partial as (state: T) => T)(oldState) : partial),
    };

    // 使用 Zod schema 对新状态进行校验
    const result = schema.safeParse(nextState);

    if (!result.success) {
      console.groupCollapsed('%c[Zustand]  Zustand State Validation Failed', 'color: red; font-weight: bold;');
      console.error('Validation errors:', result.error.flatten());
      console.log('Previous state:', oldState);
      console.log('Next state (invalid):', nextState);
      console.groupEnd();
      // 在开发中，你甚至可以抛出错误来中断无效的状态更新
      // throw new Error("Zustand state validation failed!");
    }

    // 无论校验是否成功，都调用原始的 set 函数更新状态
    // 在生产环境中，你可能希望只在校验成功时更新状态
    set(nextState, replace);
  };

  return config(newSet, get, api);
};
