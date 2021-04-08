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
    const LINE_BREAK = getLinebreak(options.lineBreak);

    const files = await globby(normalize(patterns), {cwd});
    return files.flat(Infinity).map((file) => {
        let content = stripBom(readFileSync(getPath(file, cwd), "utf8"));
        const relativeFilePath = resolve(cwd, file).replace(cwd, "").replace(/\\/gi, "/");
        const banner = render(template, {pkg, date, file: relativeFilePath});
        let lines = content.split(LINE_BREAK);
        let shebang = false;

        if (lines[0].startsWith("#!")) {
            shebang = lines.shift();
        }

        if (options.check && content.startsWith(banner)) {
            return;
        }

        if (options.replace) {
            const lines = content.split(LINE_BREAK);
            if (lines[0].startsWith("/")){
                content = lines.slice(lines.indexOf("")+1).join(LINE_BREAK);
            }
        }

        const results = [banner, "", ...lines];

        shebang && results.unshift(shebang);

        writeFileSync(getPath(file), results.join(LINE_BREAK));

        return file;
    });
};
