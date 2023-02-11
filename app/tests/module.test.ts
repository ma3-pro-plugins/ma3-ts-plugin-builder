/**
 * Jest Tests
 * =====================
 *
 * @contributors: Erez Makavy [@hepiyellow] <hepi@ma3-pro-plugins.com>
 *
 * @license: MIT License
 *
 */
import m from "@app/functions/module";

test("show hello world", async () => {
	const { app } = await m({ text: "hello-world" });
	expect(app()).toBe("hello-world");
});
