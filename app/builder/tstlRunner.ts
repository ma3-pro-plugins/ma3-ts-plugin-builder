import log from "@app/utils/logger";
import { execSync, spawn } from "node:child_process";

export function runTstl(tsconfig: string) {
	log.info(`Running TSTL`);
	execSync(`tstl -p ${tsconfig}`, { stdio: "inherit" });
}

export async function runTstlWatch(tsconfig: string) {
	log.info(`Running TSTL Watch mode`);
	return new Promise<void>((resolve) => {
		const props = ["-p", tsconfig, "--watch"];

		const proc = spawn("tstl", props);
		proc.stdout.on("data", (data) => {
			log.info(data.toString());
		});
		proc.on("error", (err) => {
			log.error(`error: ${err}`);
		});

		proc.stderr.on("data", (data) => {
			log.error(`stderr: ${data}`);
		});

		proc.on("close", (code) => {
			if (code !== 0) {
				log.info(`tstl child process exited with code ${code}`);
			}
			resolve();
		});
	});
}
