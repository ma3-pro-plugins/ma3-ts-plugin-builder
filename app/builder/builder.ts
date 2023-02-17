import type { ModuleInterface, ModuleResponseInterface } from "@app/types/module.interfaces";
import log from "@app/utils/logger";
import fse from "fs-extra";
import * as fs from "node:fs";
import * as path from "path";
import { Config, createBaseConfig, createConfig, createEntryConfig } from "./config";
import { generateEnvFile } from "./generateEnvFile";
import { generateTSConfig } from "./generateTSConfig";
import { generateXml } from "./generateXml";
import { convertImagesToBase64 } from "./imageConverter";
import { runTstl, runTstlWatch } from "./tstlRunner";
import { createMultiVersionZip } from "./zipCreator";

type BuilderFn = (params: ModuleInterface) => ModuleResponseInterface;
export const Builder: BuilderFn = ({ maconfig, buildConfig, scriptArgs }) => {
	const build = async () => {
		try {
			await doBuild();
			process.exit(0);
		} catch (error) {
			log.error(error as string);
			process.exit(1);
		}
	};

	function getTSComponent() {
		for (const comp of maconfig.components) {
			if (comp.type === "ts") {
				return comp;
			}
		}
	}

	function copyAssets(config: Config) {
		for (const comp of maconfig.components) {
			switch (comp.type) {
				case "lua":
					fs.copyFileSync(`./src/${comp.fileName}`, path.join(config.targetPluginPath, comp.fileName));
					break;
			}
		}
	}

	function installPlugin(config: Config) {
		try {
			const srcDir = path.join(config.pluginsPath, config.maPluginPathFirstPart);
			const destDir = path.join(config.maPluginsInstallPath, config.maPluginPathFirstPart);
			fse.mkdirpSync(destDir);
			fse.removeSync(path.join(destDir, config.pluginFolderNameWithVersion));
			log.info(`installPlugin: srcDir=${srcDir}`);
			// This copy merges directory contents with existing directories. If a file exists it overwrites it.
			fse.copySync(srcDir, destDir, { overwrite: true, errorOnExist: false });
			log.info(`Installed to  ${destDir}`);
		} catch (err) {
			log.error(err as string);
		}
	}

	async function doBuild() {
		const baseConfig = createBaseConfig(maconfig, scriptArgs);
		if (baseConfig.isDev) {
			log.info(`Starting DEV build for maVersion ${scriptArgs.maTargetVersion}`);
			const config = createConfig(baseConfig, scriptArgs.maTargetVersion);
			log.info("buildPlugin: DEV");
			let numOfTSComponents = 0;
			for (const comp of maconfig.components) {
				if (comp.type === "ts") {
					numOfTSComponents++;
				}
			}
			if (numOfTSComponents > 1) {
				throw Error("Only 1 TS component is supported");
			}
			convertImagesToBase64(config);
			const comp = getTSComponent();
			if (comp != undefined) {
				const entryConfig = createEntryConfig(comp.fileName, config);
				generateTSConfig(`./src/${comp.fileName}`, config, entryConfig, buildConfig);
			}
			generateXml(maconfig, config);
			copyAssets(config);
			if (comp != undefined) {
				generateEnvFile(maconfig, config, "dev");
				return runTstlWatch("tsconfig_dev.json");
			}
		} else {
			log.info("buildPlugin: PROD");
			fse.removeSync(baseConfig.distPath);
			const maTargetVersions = ["1.6", "1.8"];
			for (const maTargetVersion of maTargetVersions) {
				const config = createConfig(baseConfig, maTargetVersion);
				const comp = getTSComponent();
				generateEnvFile(maconfig, config, "prod");
				convertImagesToBase64(config);
				if (comp != undefined) {
					const entryConfig = createEntryConfig(comp.fileName, config);
					generateTSConfig(`./src/${comp.fileName}`, config, entryConfig, buildConfig);
					// transpile(config)
					runTstl("tsconfig.json");
				}
				generateXml(maconfig, config);
				copyAssets(config);
				// createZip(config, maTargetVersion)
			}

			// Create Plugin MultiVersion Zip
			log.info("Create MultiVersion Zip File");
			await createMultiVersionZip(baseConfig, buildConfig, scriptArgs);

			// Install (Copy plugin to .../gma3_library/datapools/plugins/)
			for (const maTargetVersion of maTargetVersions) {
				const config = createConfig(baseConfig, maTargetVersion);
				installPlugin(config);
			}
			log.info("buildPlugin: PROD: DONE");
		}
	}

	return {
		build: build,
	};
};
