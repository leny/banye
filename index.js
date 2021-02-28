/* @leny/banye
 *
 * /index.js
 *
 * started at 28/02/2021
 */

const ejs = require("ejs");
const findRoot = require("find-root");
const {readFileSync, writeFileSync} = require("fs");
const globby = require("globby");
const {isAbsolute, join, resolve} = require("path");
const stripBom = require("strip-bom");

const normalize = (patterns) =>
    (Array.isArray(patterns) ? patterns : [patterns])
        .filter((value) => typeof value === "string" && /\S/.test(value))
        .map((pattern) => pattern.trim());

const render = (template, context) => {
    const banner = ejs.render(readFileSync(template, "utf8"), context).trim();

    if (!banner) {
        throw new Error(`Empty banner: ${template}`);
    }

    return banner;
};

const getPath = (filename, cwd = process.cwd()) =>
    isAbsolute(filename) ? filename : join(cwd, filename);

const getLinebreak = (linebreak = "") =>
    linebreak.toLowerCase() === "crlf" ? "\r\n" : "\n";

module.exports = async (patterns, options = {}) => {
    console.log({patterns, options});

    const date = new Date();
    const cwd = getPath(options.cwd || process.cwd());
    const pkg = require(getPath("package.json", findRoot(cwd)));
    const template = getPath(options.banner || "banner.ejs", cwd);

    const files = await globby(normalize(patterns), {cwd});
    return files.flat(Infinity).map((file) => {
        const content = stripBom(readFileSync(getPath(file, cwd), "utf8"));
        const relativeFilePath = resolve(cwd, file).replace(cwd, "");
        const banner = render(template, {pkg, date, file: relativeFilePath});

        // TODO: handle options.check
        // TODO: handle options.replace

        writeFileSync(
            getPath(file),
            [banner, "", content].join(
                getLinebreak(options.lineBreaks || options.lineBreak),
            ),
        );

        return file;
    });
};
