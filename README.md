# grandMA3 TypeScript Plugin Build Script

## UNDER CONSTRUCTION !!!

> This tool is not working yet !

This is a cli build script for building grandMA3 plugins that are written in TypeScript.

The script uses:

-   Node.js 16+
-   TSTL [TypeScriptToLua](https://typescripttolua.github.io)

The build script features are:

-   Prod & Dev builds
-   Generate plugin XML file
-   Supports multiple lua plugin components.
-   Supports mutltiple MA target versions (e.g. MA version 1.6 uses different plugin XML file tags than 1.8)
-   Dev build runs in watch mode (build the lua bundle everytime a typescript file changes)
-   Auto-Install: both Dev and Pro builds automatically install the plugin in your plugins library.
-   Built-In Images: If you wish to embed small images in the code itself, then it converts images to base 64.
-   Generate plugin README.pdf from a template
-   Creates an installation ZIP file, with the README and the MA USB folder structure.

## 💫 License

-   Code and Contributions have **MIT License**

###### Copyleft (c) 2022 [Erez Makavy] ([@hepiyellow] <[hepi@ma3-pro-plugins.com](mailto:hepi@ma3-pro-plugins.com)>
