import TemplateFile from "template-file";
import { BaseConfig } from "./config";

import { BuildConfig } from "@app/types/module.interfaces";

export async function createReadMeContent(baseConfig: BaseConfig, buildConfig: BuildConfig) {
	const { author, pluginName, versionSuffix } = baseConfig;

	const renderedString = await TemplateFile.renderFile(buildConfig.readMeTemplatePath ?? "./README.template.md", {
		author,
		pluginName,
		versionSuffix,
	});

	return renderedString;
}
