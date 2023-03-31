import { BuildConfig } from "@app/types/module.interfaces";
import log from "@app/utils/logger";
import archiver from "archiver";
import fse from "fs-extra";
import { mdToPdf } from "md-to-pdf";
import * as fs from "node:fs";
import * as path from "path";
import { BaseConfig } from "./config";
import { createReadMeContent } from "./readmeGenerator";

export async function createMultiVersionZip(baseConfig: BaseConfig, buildConfig: BuildConfig) {
	const { distPath } = baseConfig;

	process.chdir(distPath);

	await createReadMePdf(baseConfig, buildConfig);
	await archive(baseConfig);

	process.chdir(buildConfig.pluginFolderPath);
}

async function createReadMePdf(baseConfig: BaseConfig, buildConfig: BuildConfig) {
	if (buildConfig.readMeTemplatePath !== undefined) {
		const readMeContent = await createReadMeContent(baseConfig, buildConfig);
		const readMeMarkdownFileName = "./README.md";
		fs.writeFileSync(readMeMarkdownFileName, readMeContent, {
			encoding: `utf8`,
		});
		const pdf = await mdToPdf({ path: readMeMarkdownFileName }).catch(console.error);

		const readMePdfFileName = "README.pdf";
		if (pdf) {
			fs.writeFileSync(readMePdfFileName, pdf.content);
			fse.unlinkSync(readMeMarkdownFileName);
		}
	}
}

async function archive(baseConfig: BaseConfig) {
	const { distRoot, distPath, pluginFSNameWithAuthorAndVersion } = baseConfig;
	return new Promise<void>((resolve, reject) => {
		// ARCHIVE
		log.info("ARCHIVE START");
		const multiVersionZipFileName = `${pluginFSNameWithAuthorAndVersion}.zip`;
		const output = fs.createWriteStream(path.join(distRoot, multiVersionZipFileName));
		const archive = archiver("zip", {
			zlib: { level: 9 }, // Sets the compression level.
		});
		output.on("close", function () {
			log.info(`${archive.pointer()} total bytes`);
			log.info("archiver has been finalized and the output file descriptor has closed.");
			resolve();
		});

		output.on("end", function () {
			log.info("Data has been drained");
		});

		archive.on("warning", function (err: any) {
			if (err.code === "ENOENT") {
				log.warning(err);
			} else {
				reject(err);
			}
		});

		archive.on("error", function (err: any) {
			reject(err);
		});

		archive.pipe(output);

		// archive.file(path.join(process.cwd(), readMePdfFileName), { name: 'README.pdf' })
		archive.directory(distPath, path.basename(distPath));
		archive.finalize();
	});
}
