import { ComponentData, MAConfig } from "@app/types/module.interfaces";
import log from "@app/utils/logger";
import * as fs from "node:fs";
import * as path from "path";
import { Config, getTranspiledFileName } from "./config";

export function generateXml(maconfig: MAConfig, config: Config) {
	const { maTargetVersion, isDev } = config;
	const pluginVersion = config.pluginVersion;
	const pluginLabel = isDev ? `DEV ${maconfig.maPluginName}` : maconfig.maPluginName;
	const installedAttr = isDev ? 'Installed="Yes"' : "";
	const xmlFileName = `${config.isDev ? `DEV ${maTargetVersion} - ` : ""}${config.fullPluginName}.xml`;

	function createComponents(componentsData: ComponentData[]) {
		let s = "";
		for (const comp of componentsData) {
			const fileName = comp.type === "ts" ? getTranspiledFileName(comp.fileName) : comp.fileName;
			s += `        <ComponentLua FileName="${fileName}" ${installedAttr} />\n`;
		}
		return s;
	}

	const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<GMA3 DataVersion="${maconfig.maVersion}">
<${maTargetVersion === "1.8" ? "UserPlugin" : "Plugin"} Name="${pluginLabel} v${pluginVersion.replaceAll(
		".",
		"_",
	)}" Version="${pluginVersion}" Author="${config.author || ""}" path="${config.maPluginPath}">
${createComponents(maconfig.components)}
</${maTargetVersion === "1.8" ? "UserPlugin" : "Plugin"}>
</GMA3>
`;

	fs.mkdirSync(config.targetPluginPath, { recursive: true });
	const xmlFilePath = path.join(config.targetPluginPath, xmlFileName);
	fs.writeFileSync(xmlFilePath, xmlContent, { encoding: `utf8` });
	log.debug(`Created ${xmlFilePath}`);
}
