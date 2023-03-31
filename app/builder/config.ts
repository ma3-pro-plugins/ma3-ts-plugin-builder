import { BuildConfig, MAConfig } from "@app/types/module.interfaces";
import log from "@app/utils/logger";
import * as path from "path";

const MA_USB_PLUGINS_PATH = `grandMA3/gma3_library/datapools/plugins/`;
function createFSName(...parts: string[]) {
	return parts.join(" - ");
}

export function createBaseConfig(maconfig: MAConfig, buildConfig: BuildConfig) {
	function assertThrow(condition: any, msg: string) {
		if (!condition) {
			log.error(msg);
			process.exit();
		}
	}
	const maPluginsInstallPath = path.join(maconfig.maInstallPath, "gma3_library/datapools/plugins/");
	const { maPluginName, pluginVersion } = maconfig;
	assertThrow(pluginVersion, "macofig.json missing 'pluginVersion' property");
	const versionSuffix = `v${maconfig.pluginVersion}`;
	const author = maconfig.author;
	const authorX = author.replace(" ", "");
	const pluginFolderNameWithVersion = buildConfig.isDev
		? `${maPluginName}`
		: createFSName(maPluginName, versionSuffix);
	const pluginFSNameWithAuthorAndVersion = createFSName(author, maPluginName, versionSuffix);
	const distRoot = path.join(process.cwd(), buildConfig.distPath ?? "dist");
	const distPath = path.join(distRoot, pluginFSNameWithAuthorAndVersion);

	return {
		author,
		authorX,
		distRoot,
		distPath,
		isDev: buildConfig.isDev,
		maPluginsInstallPath,
		pluginVersion,
		pluginsPath: buildConfig.isDev ? path.join(maPluginsInstallPath) : path.join(distPath, MA_USB_PLUGINS_PATH),
		pluginFolderPath: buildConfig.pluginFolderPath,
		pluginFolderNameWithVersion,
		pluginFSNameWithAuthorAndVersion,
		pluginName: maPluginName,
		relativePathToRoot: `./`,
		srcPath: "./src/",
		versionSuffix,
	};
}

export type BaseConfig = ReturnType<typeof createBaseConfig>;

export function createConfig(baseConfig: BaseConfig, maTargetVersion: string) {
	const { author, pluginsPath, pluginFolderNameWithVersion, pluginName, versionSuffix, isDev } = baseConfig;

	const maPluginPathFirstPart = isDev ? `${author} DEV` : `${author}`;
	const maPluginPath = path.join(maPluginPathFirstPart, pluginFolderNameWithVersion, `MA3 ${maTargetVersion}`);
	const fullPluginName = isDev
		? `${pluginName} DEV`
		: `MA3 ${maTargetVersion} - ${author} - ${pluginName} - ${versionSuffix}`;

	return {
		...baseConfig,
		fullPluginName,
		targetPluginPath: path.join(pluginsPath, maPluginPath),
		maTargetVersion,
		maPluginPath,
		maPluginPathFirstPart,
	};
}

export type Config = ReturnType<typeof createConfig>;

export function getTranspiledFileName(fileName: string) {
	return `${path.basename(fileName, path.extname(fileName))}.lua`;
}

export function createEntryConfig(fileName: string, config: Config) {
	const maPluginPath = config.maPluginPath;
	const targetFileName = getTranspiledFileName(fileName);

	return {
		targetFileName,
		targetBundlePath: path.join(config.pluginsPath, maPluginPath, targetFileName),
	};
}

export type EntryConfig = ReturnType<typeof createEntryConfig>;
