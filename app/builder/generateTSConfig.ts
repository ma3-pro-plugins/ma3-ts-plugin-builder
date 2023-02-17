import { BuildConfig } from "@app/types/module.interfaces";
import log from "@app/utils/logger";
import * as fs from "node:fs";
import * as path from "path";
import { Config, EntryConfig } from "./config";

const BASE_TSCONFIG_FILE_NAME = "tsconfig_base";

export function generateTSConfig(
	entryPath: string,
	config: Config,
	entryConfig: EntryConfig,
	buildConfig: BuildConfig,
) {
	/**
	 * sourceMapTraceback is disabled since the line numbers are wrong
	 */
	const tsconfigContent = `{
  "extends": "./${BASE_TSCONFIG_FILE_NAME}",
  "include": ["${config.relativePathToRoot}node_modules/@ma3-pro-plugins/grandma3-types/index.d.ts", "lib/**/*", "src/**/*"],
  "tstl": {
    "luaTarget": "5.3",
    "luaBundleEntry": "${entryPath}",
    "luaBundle": "${entryConfig.targetBundlePath}",
    "luaPlugins": [
      { "name": "${config.relativePathToRoot}${buildConfig.tstlPluginPath}" }
    ],
    "sourceMapTraceback": true,
    "noResolvePaths": ["json", "lfs"]
  }
}
    `;
	const tsconfigFilePath = path.join(config.pluginFolderPath, config.isDev ? "tsconfig_dev.json" : "tsconfig.json");
	fs.writeFileSync(tsconfigFilePath, tsconfigContent, { encoding: `utf8` });
	log.debug(`Written ${tsconfigFilePath}`);

	const tsconfigBaseContent = `{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["esnext"],
    "moduleResolution": "node",
    "types": ["lua-types/5.3"],
    "strict": true,
    "baseUrl": "."
  }
}
`;

	const tsconfigBaseFilePath = path.join(config.pluginFolderPath, `${BASE_TSCONFIG_FILE_NAME}.json`);
	fs.writeFileSync(tsconfigBaseFilePath, tsconfigBaseContent, { encoding: `utf8` });
	log.debug(`Written ${tsconfigBaseFilePath}`);
}
