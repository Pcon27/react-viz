import React, { useState } from "react";
import TreeVisualizer from "./TreeVisuailizer";
import * as BabelParser from "@babel/parser";
import * as traverse from "@babel/traverse";
import process from "process"; // Add process polyfill
import TreeFlow from "./TreeFlow";
import TreeFlow2 from "./TreeFlow2";
import { generateNodesAndEdges } from "./helpers/treeBuilder";
window.process = process; // Polyfill for process

import { ReactFlowProvider } from "react-flow-renderer";
import ComponentVisualizer from "./ComponentVisualizer";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const App: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

  // const handleFileUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const fileContent = await file.text();
  //   const ast = BabelParser.parse(fileContent, {
  //     sourceType: "module",
  //     plugins: ["jsx", "typescript"],
  //   });

  //   const imports: Record<string, string> = {}; // To store imported components
  //   const componentsUsed: Set<string> = new Set(); // To store detected JSX components
  //   let rootComponent: string | null = null;

  //   // Step 1: Collect imports
  //   traverse.default(ast, {
  //     ImportDeclaration(path) {
  //       path.node.specifiers.forEach((specifier) => {
  //         if (specifier.local.name) {
  //           imports[specifier.local.name] = path.node.source.value; // Import name and source
  //         }
  //       });
  //     },
  //   });

  //   // Step 2: Detect root component
  //   traverse.default(ast, {
  //     ExportDefaultDeclaration(path) {
  //       if (path.node.declaration.type === "Identifier") {
  //         rootComponent = path.node.declaration.name;
  //       } else if (
  //         path.node.declaration.type === "FunctionDeclaration" &&
  //         path.node.declaration.id
  //       ) {
  //         rootComponent = path.node.declaration.id.name;
  //       }
  //     },
  //     FunctionDeclaration(path) {
  //       if (!rootComponent) {
  //         rootComponent = path.node.id?.name || null;
  //       }
  //     },
  //   });

  //   // Step 3: Detect JSX components used in the file
  //   traverse.default(ast, {
  //     JSXOpeningElement(path) {
  //       const tagName =
  //         path.node.name.type === "JSXIdentifier" ? path.node.name.name : null;

  //       if (tagName) {
  //         componentsUsed.add(tagName);
  //       }
  //     },
  //   });

  //   // Step 4: Build tree structure
  //   const rootNode: TreeNode = {
  //     name: rootComponent || "Root",
  //     children: Array.from(componentsUsed).map((name) => ({
  //       name,
  //       children: [],
  //     })),
  //   };

  //   console.log("Imports:", imports);
  //   console.log("Components Used:", componentsUsed);
  //   console.log("Tree:", JSON.stringify(rootNode, null, 2));

  //   setTreeData(rootNode);
  // };

  // UNDO From HERE

  //   interface TreeNode {
  //     id: string;
  //     name: string;
  //     children?: TreeNode[];
  //   }

  //   const handleFileUpload = async (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const file = event.target.files?.[0];
  //     if (!file) {
  //       alert("Please upload a valid file.");
  //       return;
  //     }

  //     try {
  //       const fileContent = await file.text();
  //       const ast = BabelParser.parse(fileContent, {
  //         sourceType: "module",
  //         plugins: ["jsx", "typescript"],
  //       });

  //       const imports: Record<string, string> = {};
  //       const componentChildren: Record<string, Set<string>> = {};
  //       let rootComponent: string | null = null;

  //       // Step 1: Traverse to detect imports and components
  //       traverse.default(ast, {
  //         ImportDeclaration(path) {
  //           path.node.specifiers.forEach((specifier) => {
  //             if (
  //               specifier.type === "ImportDefaultSpecifier" ||
  //               specifier.type === "ImportSpecifier"
  //             ) {
  //               imports[specifier.local.name] = path.node.source.value;
  //               console.log("Import Detected:", specifier.local.name);
  //             }
  //           });
  //         },
  //         ExportDefaultDeclaration(path) {
  //           if (path.node.declaration.type === "Identifier") {
  //             rootComponent = path.node.declaration.name;
  //           } else if (path.node.declaration.type === "FunctionDeclaration") {
  //             rootComponent =
  //               path.node.declaration.id?.name || "AnonymousDefault";
  //           } else if (path.node.declaration.type === "ClassDeclaration") {
  //             rootComponent =
  //               path.node.declaration.id?.name || "AnonymousClassDefault";
  //           }
  //         },
  //         FunctionDeclaration(path) {
  //           const name = path.node.id?.name;
  //           if (!rootComponent && name) rootComponent = name;
  //           if (name) componentChildren[name] = new Set();
  //         },
  //         ClassDeclaration(path) {
  //           const name = path.node.id?.name;
  //           if (!rootComponent && name) rootComponent = name;
  //           if (name) componentChildren[name] = new Set();
  //         },
  //         VariableDeclarator(path) {
  //           if (
  //             path.node.init?.type === "ArrowFunctionExpression" &&
  //             path.node.id.type === "Identifier"
  //           ) {
  //             const name = path.node.id.name;
  //             if (!rootComponent) rootComponent = name;
  //             if (name) componentChildren[name] = new Set();
  //           }
  //         },
  //       });

  //       if (!rootComponent) {
  //         console.error("No root component detected.");
  //         alert("Failed to detect the root component.");
  //         return;
  //       }

  //       // console.log("Root Component:", rootComponent);
  //       // console.log("Imports:", imports);

  //       // Step 2: Traverse JSX elements to build relationships
  //       traverse.default(ast, {
  //         JSXOpeningElement(path) {
  //           const tagName =
  //             path.node.name.type === "JSXIdentifier"
  //               ? path.node.name.name
  //               : null;

  //           if (!tagName || !imports[tagName]) {
  //             console.log("Ignored Tag:", tagName);
  //             return;
  //           }

  //           const parent = path.findParent(
  //             (p) =>
  //               p.isFunctionDeclaration() ||
  //               p.isClassDeclaration() ||
  //               p.isVariableDeclarator() // Detect arrow functions
  //           );

  //           const parentName = parent?.node.id?.name;

  //           if (parentName && componentChildren[parentName]) {
  //             console.log(`JSX Tag Found: ${tagName}, Parent: ${parentName}`);
  //             componentChildren[parentName].add(tagName);
  //           } else {
  //             console.warn(`JSX Tag ${tagName} has no parent.`);
  //           }
  //         },
  //       });

  //       console.log("Component Relationships:", componentChildren);

  //       // Step 3: Build the tree
  //       const buildTree = (name: string): TreeNode => {
  //         return {
  //           id: name,
  //           name,
  //           children: Array.from(componentChildren[name] || []).map(buildTree),
  //         };
  //       };

  //       const treeData = buildTree(rootComponent);
  //       console.log("Tree Data:", JSON.stringify(treeData, null, 2));

  //       // Step 4: Update state with tree data
  //       setTreeData(treeData);
  //     } catch (error) {
  //       console.error("Unexpected error occurred:", error);
  //       alert(
  //         "An error occurred while processing the file. Check the console for details."
  //       );
  //     }
  //   };

  //   console.log("Input treeData:", JSON.stringify(treeData, null, 2));

  //   const { nodes, edges } = treeData
  //     ? generateNodesAndEdges(treeData)
  //     : { nodes: [], edges: [] };

  //   console.log("Generated Nodes:", nodes);
  //   console.log("Generated Edges:", edges);

  //   return (
  //     <div className="app-container">
  //       <h1>React Component Tree Visualizer</h1>
  //       <input type="file" accept=".js,.jsx,.tsx" onChange={handleFileUpload} />
  //       {/* {treeData && <TreeFlow data={treeData} />} */}
  //       {treeData && <TreeFlow2 nodes={nodes} edges={edges} />}
  //       {treeData && <TreeVisualizer data={treeData} />}
  //     </div>
  //   );
  // };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlowProvider>
        <ComponentVisualizer />
      </ReactFlowProvider>
    </div>
  );
};

export default App;
