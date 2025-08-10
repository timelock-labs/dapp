/**
 * Sponsors API types
 */

import type { Partner } from './partner';

/**
 * Sponsor entity (using Partner structure for consistency)
 */
export interface Sponsor extends Partner {
	// Additional sponsor-specific fields can be added here if needed
}

/**
 * Sponsors data response
 */
export interface SponsorsData {
	sponsors: Partner[];
	partners: Partner[];
}

/**
 * Sponsors API response wrapper
 */
export interface SponsorsApiResponse {
	data: SponsorsData;
	success: boolean;
}
