/**
 * Framework Registry
 *
 * Central export point for all validation frameworks.
 * This file provides a registry of all available frameworks indexed by idea type.
 */

import { API_TOOL_FRAMEWORK } from "./api-tool.framework";
import { CHROME_EXTENSION_FRAMEWORK } from "./chrome-extension.framework";
import type { Framework } from "./framework-schema";
import { GENERIC_FRAMEWORK } from "./generic.framework";
import { INFO_PRODUCT_FRAMEWORK } from "./info-product.framework";
import { MARKETPLACE_FRAMEWORK } from "./marketplace.framework";
import { MICRO_SAAS_FRAMEWORK } from "./micro-saas.framework";
import { MOBILE_APP_FRAMEWORK } from "./mobile-app.framework";
import { SAAS_FRAMEWORK } from "./saas.framework";

/**
 * Registry of all frameworks indexed by idea type
 */
export const FRAMEWORKS: Framework[] = [
	SAAS_FRAMEWORK,
	MICRO_SAAS_FRAMEWORK,
	MOBILE_APP_FRAMEWORK,
	CHROME_EXTENSION_FRAMEWORK,
	API_TOOL_FRAMEWORK,
	MARKETPLACE_FRAMEWORK,
	INFO_PRODUCT_FRAMEWORK,
	GENERIC_FRAMEWORK,
];

/**
 * Get all frameworks as an array
 */
export function getAllFrameworks(): Framework[] {
	return FRAMEWORKS;
}
