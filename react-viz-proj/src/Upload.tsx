import React, { useState } from "react";
import Tree from "react-d3-tree";
import * as BabelParser from "@babel/parser";
import traverse from "@babel/traverse";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const Upload: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

  // Parse React component file and build tree data
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileContent = await file.text();
    const ast = BabelParser.parse(fileContent, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const rootNode: TreeNode = { name: "Root", children: [] };
    const componentMap: Record<string, TreeNode> = {};

    traverse.default(ast, {
      // Detect component declarations
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (name) {
          componentMap[name] = { name, children: [] };
        }
      },
      ClassDeclaration(path) {
        const name = path.node.id?.name;
        if (name) {
          componentMap[name] = { name, children: [] };
        }
      },
      // Detect JSX elements
      JSXOpeningElement(path) {
        const componentName =
          path.node.name.type === "JSXIdentifier" ? path.node.name.name : null;
        if (componentName && componentMap[componentName]) {
          rootNode.children?.push(componentMap[componentName]);
        }
      },
    });

    setTreeData(rootNode);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1>React Component Tree Visualizer</h1>
      <input type="file" accept=".js,.jsx,.tsx" onChange={handleFileUpload} />
      {treeData && (
        <div style={{ width: "100%", height: "80%" }}>
          <Tree data={treeData} orientation="vertical" />
        </div>
      )}
    </div>
  );
};

export default Upload;
