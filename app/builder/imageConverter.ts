import log from "@app/utils/logger";
import * as fs from "node:fs";
import * as path from "path";
import { Config } from "./config";

export function convertImagesToBase64(config: Config) {
	log.info(`convertImagesToBase64`);
	const sourceFolder = "./src/images/";
	if (!fs.existsSync(sourceFolder)) {
		return;
	}

	const targetFolder = path.join("./src/", "__imagesB64/");
	fs.mkdirSync(targetFolder, { recursive: true });

	const ignorePattern = /$\..*/g;
	const files = fs.readdirSync(sourceFolder).filter((fileName) => !fileName.startsWith("."));
	function toTSFileName(fileName: string) {
		const fileNameOnly = path.basename(fileName, ".png");
		return `__${fileNameOnly}.ts`;
	}

	files.forEach((fileName) => {
		if (path.extname(fileName) === ".png") {
			const data = fs.readFileSync(path.join(sourceFolder, fileName));
			const targetPath = path.join(targetFolder, toTSFileName(fileName));
			const content = `export const fileName = "${fileName}"\nexport const imageBase64 = "${data.toString(
				"base64",
			)}"`;
			fs.writeFileSync(targetPath, content, { encoding: `utf8` });
		} else {
			log.error(`Non .png image files are not supported yet. Remove ${fileName} from ./src/images/`);
			process.exit();
		}
	});

	function fileKey(fileName: string) {
		return path.basename(fileName, ".png").replace(" ", "_");
	}
	const importStatements = files
		.map((fileName) => {
			const variableName = fileKey(fileName);
			return `import {  imageBase64 as ${variableName}} from "./${path.basename(toTSFileName(fileName), ".ts")}"`;
		})
		.join("\n");

	const filesProps = files
		.map((fileName) => {
			const variableName = fileKey(fileName);
			return `${variableName}: { fileName: "${fileName}", imageBase64: ${variableName} }`;
		})
		.join(",\n\t");

	const fileKeys = files.map((fileName) => `"${fileKey(fileName)}"`).join(" |\n\t");
	const content = `${importStatements}\n
export type ImageKey = ${fileKeys}

export const images: {[key in ImageKey]: {fileName: string, imageBase64: string}} = {
    ${filesProps}
}`;
	const indexPath = path.join(targetFolder, "index.ts");
	fs.writeFileSync(indexPath, content, { encoding: `utf8` });
}
