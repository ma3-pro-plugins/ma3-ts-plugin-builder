/**
 * Logger
 * =====================
 * The best alternative to the console.log statement
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import Logger, { LoggerOptions } from "@ptkdev/logger";
import config from "@configs/config";

const options: LoggerOptions = config.logger as unknown as LoggerOptions; // typescript issue https://github.com/microsoft/TypeScript/issues/26552#issuecomment-484124880
const logger = new Logger(options);

export { logger };
export default logger;
