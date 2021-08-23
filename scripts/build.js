const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const childProcess = require("child_process");
const rimraf = require("rimraf");

const readDir = (s) =>
  fs
    .readdirSync(s, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory() ? readDir(path.join(s, f.name)) : [path.join(s, f.name)]
    );
const appPath = (p) => path.resolve(fs.realpathSync(process.cwd()), p);
const promiseRimraf = (s) => new Promise((resolve) => rimraf(s, resolve));

const buildDir = (dir) =>
  esbuild
    .build({
      entryPoints: [appPath("pages/_html.tsx")],
      bundle: true,
      target: "node12",
      platform: "node",
      outfile: path.join("tmp", "_html.js"),
      external: ["react", "react-dom"],
    })
    .then(() => fs.mkdirSync("out"))
    .then(() =>
      Promise.all(
        fs
          .readdirSync(dir, { withFileTypes: true })
          .filter((file) => !/_html\.tsx$/.test(file.name))
          .flatMap((file) =>
            file.isDirectory()
              ? buildDir(path.join(dir, file.name))
              : esbuild
                  .build({
                    entryPoints: [appPath(path.join(dir, file.name))],
                    target: "node12",
                    platform: "node",
                    bundle: true,
                    outfile: path.join(
                      "tmp",
                      dir.replace(/^pages/, ""),
                      file.name.replace(/\.tsx/, ".js")
                    ),
                    external: ["react", "react-dom"],
                  })
                  .then((result) => {
                    if (result.errors.length) {
                      throw new Error(JSON.stringify(result.errors));
                    }
                    const ls = childProcess.spawn("node", [
                      path.join("tmp", "_html.js").replace(/\\/g, "/"),
                      path
                        .join(
                          dir.replace(/^pages/, ""),
                          file.name.replace(/\.tsx/, ".js")
                        )
                        .replace(/\\/g, "/"),
                    ]);
                    return new Promise((resolve) => {
                      let loggedErrors = false;
                      ls.stdout.on("data", (data) => {
                        console.log(`stdout: ${data}`);
                      });

                      ls.stderr.on("data", (data) => {
                        console.error(`stderr: ${data}`);
                        loggedErrors = true;
                      });

                      ls.on("close", (code) => {
                        code || loggedErrors
                          ? process.exit(code)
                          : resolve(code);
                      });
                    });
                  })
          )
      )
    );

Promise.all([promiseRimraf("tmp"), promiseRimraf("out")])
  .then(() => {
    fs.mkdirSync("tmp");
    return buildDir("pages");
  })
  .then(() => promiseRimraf("tmp"))
  .then(() => {
    console.log("Finished!");
  });
