#!/usr/bin/env node
/* @leny/banye
 *
 * /index.js
 *
 * started at 28/02/2021
 */

const banye = require("./index");
const cli = require("cli");
const util = require("util");

cli.enable("help", "status", "version");

cli.parse({
    banner: [
        "b",
        "An EJS banner file. Relative to `process.cwd`",
        "file",
        "banner.ejs",
    ],
    replace: [
        "r",
        "Replace the starting lines of the files (up to the first empty line) with the banner",
        "bool",
        false,
    ],
    check: [
        "c",
        "Check if header already exists in good format before add or replace",
    ],
});

cli.main(async function(args, options) {
    try {
        const files = await banye(args, options);

        if (!files.length) {
            this.debug("No file to parse!");
            return;
        }

        this.debug(
            util.format(
                "Add banner to %s files:%s\n",
                files.length,
                `\n  ${files.join("\n  ")}`,
            ),
        );
    } catch (error) {
        this.error(error.message);
    }
});
