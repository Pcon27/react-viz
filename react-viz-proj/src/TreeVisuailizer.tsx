import React from "react";
import Tree from "react-d3-tree";
import process from "process";
window.process = process;

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeVisualizerProps {
  data: TreeNode;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <Tree data={data} orientation="vertical" pathFunc="straight" />
    </div>
  );
};

export default TreeVisualizer;
