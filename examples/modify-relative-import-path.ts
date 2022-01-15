import { API, FileInfo } from "jscodeshift";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration)
    .filter((imp) => {
      const importLine = imp.node;
      return (importLine.source.value as string).startsWith("../");
    })
    .replaceWith((p) => {
      let targetPath = p.node.source.value as string;
      const filePaths = file.path.split("/");
      for (let index = 1; index < filePaths.length - 1; index++) {
        targetPath = targetPath.replace("..", filePaths[index]);
      }
      console.log("targePath:", targetPath);

      return j.importDeclaration(p.node.specifiers, {
        type: "Literal",
        value: targetPath,
      });
    })
    .toSource();
}

// jscodeshift -t ./examples/modify-relative-import-path.ts  --extensions=ts --parser=ts ./src/deep/deep/3.ts --print --dry
