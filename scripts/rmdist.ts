/**
 * Delete dist folder
 * =====================
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import * as shell from "shelljs";
declare const __dirname: string;

const path = `${__dirname}/../dist`;

shell.rm("-Rf", path);
