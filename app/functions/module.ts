/**
 * Node Module
 * =====================
 *
 * Show hello world text
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import type { ModuleInterface, ModuleResponseInterface } from "@app/types/module.interfaces";

/**
 * Hello World
 * =====================
 *
 * Print hello-world, run with: npx @ma3-pro-plugins/ma3_ts_plugin_build
 *
 * @interface [ModuleInterface ModuleResponseInterface](https://github.com/ma3-pro-plugins/build_plugin/blob/main/app/types/module.interfaces.ts)
 *
 * @param {string} {text} - input string
 *
 * @return {Promise<ModuleResponseInterface>} (async) app() function that return string
 *
 */
const m = async ({ text }: ModuleInterface): Promise<ModuleResponseInterface> => {
	const app = () => text;

	return {
		app,
	};
};

export default m;
