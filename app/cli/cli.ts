#! /usr/bin/env node
/**
 * CLI
 * =====================
 * Command Line Interface
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import { Builder } from "@app/builder/builder";
import { ScriptArgs } from "@app/types/module.interfaces";
import * as fs from "node:fs";

(async () => {
	const scriptArgs: ScriptArgs = {
		pluginFolderPath: "./",
		isDev: process.argv[2] === "dev",
		maTargetVersion: "1.8",
	};

	const maconfigJson = JSON.parse(fs.readFileSync(`${scriptArgs.pluginFolderPath}maconfig.json`).toString());
	const buildconfigJson = JSON.parse(fs.readFileSync(`${scriptArgs.pluginFolderPath}buildconfig.json`).toString());
	const builder = Builder({
		maconfig: maconfigJson,
		buildConfig: { ...buildconfigJson, ...scriptArgs },
	});

	await builder.build();
})();
