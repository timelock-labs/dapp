// This is a workaround to allow non-component files to access the next-intl translator function.
// It should be initialized in a top-level client component.

import type { useTranslations } from 'next-intl';

// Define a type for the translator function for clarity
type Translator = ReturnType<typeof useTranslations>;

// A global variable to hold the translator function.
let global_t: Translator = (key: string) => key; // Default fallback returns the key itself

/**
 * Sets the global translator function.
 * This should be called from a Client Component where useTranslations() is available.
 * @param t The translator function obtained from useTranslations().
 */
export const setGlobalTranslator = (t: Translator) => {
  global_t = t;
};

/**
 * Gets the global translator function.
 * This can be called from any module.
 * @returns The globally available translator function.
 */
export const getGlobalTranslator = () => {
  return global_t;
};
