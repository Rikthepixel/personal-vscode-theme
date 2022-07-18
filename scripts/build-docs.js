const fs = require("fs");
const path = require("path");
// const { minify } = require("minify");
// console.log(minify);
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

const forFilesWithExtention = (dir, ext, onFound) => {
    const content = fs.readdirSync(dir, { withFileTypes: true });
    content.forEach(dirent => {
        const filePath = dir + dirent.names;
        if (dirent.isDirectory()) {
            forFilesWithExtention(filePath, ext, onFound);
        } else {
            const fileExt = path.extname(filePath);
            console.log(ext);
            if (fileExt !== ext) {
                onFound(filePath);
            }
        }
    });
};

// forFilesWithExtention("./dist", "html", (path) => minify(path));