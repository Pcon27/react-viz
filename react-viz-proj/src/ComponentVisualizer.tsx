import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { parse } from "@babel/parser";

const ComponentVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const parseComponents = (fileContent: string) => {
    const ast = parse(fileContent, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "classProperties"],
    });

    const components: Record<string, any> = {};
    const edges: any[] = [];
    const hierarchy: Record<string, number> = {};

    const traverse = (
      node: any,
      currentParent: string | null = null,
      depth = 0
    ) => {
      if (!node) return;

      // Detect top-level components
      if (
        (node.type === "FunctionDeclaration" ||
          node.type === "ClassDeclaration") &&
        node.id
      ) {
        components[node.id.name] = {
          id: node.id.name,
          label: node.id.name,
          props: [],
        };
        hierarchy[node.id.name] = depth;

        // This component becomes the parent for its JSX children
        currentParent = node.id.name;
      }

      // Detect arrow function components
      if (
        node.type === "VariableDeclaration" &&
        node.declarations[0]?.init?.type === "ArrowFunctionExpression" &&
        node.declarations[0]?.id
      ) {
        const componentName = node.declarations[0].id.name;
        components[componentName] = {
          id: componentName,
          label: componentName,
          props: [],
        };
        hierarchy[componentName] = depth;

        // This component becomes the parent for its JSX children
        currentParent = componentName;
      }

      // Detect imported components
      if (node.type === "ImportDeclaration") {
        const importedComponent = node.specifiers[0]?.local?.name;
        if (importedComponent) {
          components[importedComponent] = {
            id: importedComponent,
            label: importedComponent,
            props: [],
          };
          hierarchy[importedComponent] = depth;
        }
      }

      // Handle JSX elements (child components and props)
      if (node.type === "JSXElement") {
        const componentName = node.openingElement.name.name;

        // Only create edges if the parent exists
        if (currentParent && components[componentName]) {
          edges.push({
            id: `${currentParent}-${componentName}`,
            source: currentParent,
            target: componentName,
          });

          // Increment depth for the child component
          hierarchy[componentName] = depth + 1;
        }

        // Extract props from the JSX element
        const props = node.openingElement.attributes
          .map((attr: any) => attr.name?.name)
          .filter(Boolean);
        if (components[componentName]) {
          components[componentName].props.push(...props);
        }

        // Update the parent for this JSXElement's children
        const newParent = components[componentName]
          ? componentName
          : currentParent;

        // Traverse children with the new parent
        for (const key in node) {
          if (Array.isArray(node[key])) {
            node[key].forEach((child) => traverse(child, newParent, depth + 1));
          } else if (typeof node[key] === "object") {
            traverse(node[key], newParent, depth + 1);
          }
        }

        return; // End processing for this JSXElement
      }

      // Traverse other nodes without updating the parent
      for (const key in node) {
        if (Array.isArray(node[key])) {
          node[key].forEach((child) => traverse(child, currentParent, depth));
        } else if (typeof node[key] === "object") {
          traverse(node[key], currentParent, depth);
        }
      }
    };

    traverse(ast);

    console.log("Components:", components);
    console.log("Edges:", edges);
    console.log("Hierarchy:", hierarchy);

    // Calculate positions based on hierarchy
    const positions = {};
    let maxDepth = 0;

    Object.keys(hierarchy).forEach((key) => {
      const depth = hierarchy[key];
      maxDepth = Math.max(maxDepth, depth);
      positions[depth] = positions[depth] || [];
      positions[depth].push(key);
    });

    const nodeSpacing = 200;
    const depthSpacing = 80;

    setNodes(
      Object.keys(components).map((key) => {
        const depth = hierarchy[key];
        const index = positions[depth].indexOf(key);
        const propsLabel =
          components[key].props.length &&
          `Props: ${components[key].props.join(", ")}`;

        return {
          id: key,
          data: {
            label: `${components[key].label}\n${propsLabel}`,
            schema: [
              { title: "id", type: "uuid" },
              { title: "name", type: "varchar" },
              { title: "description", type: "varchar" },
              { title: "country", type: "varchar" },
            ],
          },
          position: {
            x: index * nodeSpacing, // Horizontal spacing
            y: depth * depthSpacing, // Vertical spacing
          },
        };
      })
    );

    setEdges(edges);

    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        parseComponents(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <input
        type="file"
        accept=".js, .jsx, .ts, .tsx"
        onChange={handleFileUpload}
      />
      <ReactFlow
        // elements={[...nodes, ...edges]}
        nodes={nodes}
        edges={edges}
        style={{ width: "100%", height: "90%" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <div>
        <h2>Debug Info</h2>
        <pre>{JSON.stringify({ nodes, edges }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ComponentVisualizer;
