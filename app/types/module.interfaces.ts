export type EnvType = "prod" | "dev";

export type ComponentData = {
	type: "ts" | "lua";
	fileName: string;
};
export type MAConfig = {
	/** e.g. "/Users/[user]/MALightingTechnology/" */
	maInstallPath: string;
	/** e.g. "1.8.8" */
	maVersion: string;
	author: string;
	organizationId: string;
	/** usually a lowercase plugin name with underscores instead of spaces */
	pluginId: string;
	pluginVersion: string;
	/** No dots allowed */
	maPluginName: string;
	components: ComponentData[];

	/** MA version : 1.6, 1.8 when running dev mode */
	devMATargetVersion: string;
};

export type BuildConfig = {
	tstlPluginPath: string;
	/** Relative to package.json */
	distPath: string;
	readMeTemplatePath?: string;
	pluginFolderPath: string;
	isDev: boolean;
	maTargetVersion: string;
};

export type ScriptArgs = {
	pluginFolderPath: string;
	isDev: boolean;
	maTargetVersion: string;
};
export interface ModuleInterface {
	maconfig: MAConfig;
	buildConfig: BuildConfig;
	// scriptArgs: ScriptArgs;
}

export interface ModuleResponseInterface {
	build: () => Promise<string>;
}
