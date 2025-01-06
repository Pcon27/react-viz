import React from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import getLayoutedElements from "./helpers/layout";

interface TreeFlowProps {
  nodes: Node[];
  edges: Edge[];
}

const TreeFlow: React.FC<TreeFlowProps> = ({ nodes, edges }) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges
  );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TreeFlow;
