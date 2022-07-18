import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import { minify } from "minify";

if (fs.existsSync("./dist")) {
    console.log("Build docs: Clearing dist folder");
    fs.rmSync("dist", {
        force: true,
        recursive: true
    });
}

console.log("Build docs: Copying docs to dist");
fs.cpSync("./docs", "./dist/", {
    recursive: true,
});

if (!fs.existsSync("./dist/assets")) {
    console.log("Build docs: Creating assets folder");
    fs.mkdirSync("./dist/assets");
}

const forFilesWithExtention = async (dir, ext, onFound) => {
    let fileParsingTasks = [];
    let folderTasks = [];
    fs.readdirSync(dir, { withFileTypes: true })
        .forEach(async (dirent) => {
            const filePath = `${dir}/${dirent.name}`;
            if (dirent.isDirectory()) {
                folderTasks.push(
                    forFilesWithExtention(filePath, ext, onFound)
                );
            } else if (path.extname(filePath) === ext) {
                fileParsingTasks.push(onFound(filePath));
            }
        });

    const childrenFileParsingTasks = await Promise.all(folderTasks);
    childrenFileParsingTasks.forEach((childFileParsingTasks) => {
        fileParsingTasks = fileParsingTasks.concat(childFileParsingTasks);
    });

    return fileParsingTasks;
};

console.log("Build docs: minifying html files");
forFilesWithExtention("./dist", ".html", async (path) => {
    console.log("\t- " + path);
    const output = await minify(path);
    const file = await fsPromise.open(path, "w");
    await file.writeFile(output);
}).then(async (minifyPromises) => {
    Promise.all(minifyPromises)
        .then(() => {
            console.log("Build docs: All HTML files minified succefully");
        })
        .catch((e) => {
            console.log("Build docs: Something went wrong while minifying HTML files");
            throw e;
        });
});

