import React from "react";
import ReactFlow from "react-flow-renderer";
import { generateNodesAndEdges } from "./helpers/treeBuilder";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TreeFlowProps {
  data: TreeNode;
}

const TreeFlow: React.FC<TreeFlowProps> = ({ data }) => {
  const { nodes, edges } = generateNodesAndEdges(data);

  // Debugging Logs
  console.log("Generated Nodes:", nodes);
  console.log("Generated Edges:", edges);

  // Check for empty or invalid data
  if (nodes.length === 0) {
    console.error("No nodes generated.");
    return <div>No nodes available to render.</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default TreeFlow;

// import React from "react";
// import ReactFlow, { Background, Controls } from "react-flow-renderer";
// import getLayoutedElements from "./helpers/layout";

// interface TreeFlowProps {
//   nodes: Node[];
//   edges: Edge[];
// }

// const TreeFlow: React.FC<TreeFlowProps> = ({ nodes, edges }) => {
//   const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//     nodes,
//     edges
//   );

//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} fitView>
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };

// export default TreeFlow;
