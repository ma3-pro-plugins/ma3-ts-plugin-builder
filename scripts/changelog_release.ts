/**
 * Version
 * =====================
 * Increment package.json version
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import * as fs from "fs";
import Logger from "@ptkdev/logger";

const logger = new Logger();

if (fs.existsSync("./CHANGELOG.md")) {
	fs.readFile("./CHANGELOG.md", "utf8", (error, data) => {
		if (error) {
			logger.error(JSON.stringify(error));
		}

		const changelog = data.match(/\n([\s\S]*)-->\n/gm);
		changelog?.forEach((c) => {
			fs.writeFile("./CHANGELOG_RELEASE.txt", c, function writeJSON(error) {
				if (error) {
					logger.error(JSON.stringify(error));
				}
			});
		});
	});
}
