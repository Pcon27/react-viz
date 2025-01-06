// import { Node, Edge } from 'react-flow-renderer';

// interface TreeNode {
//   id: string;
//   name: string;
//   children?: TreeNode[];
// }

// export const generateNodesAndEdges = (
//   node: TreeNode,
//   parentId: string | null = null,
//   nodes: Node[] = [],
//   edges: Edge[] = []
// ) => {
//   // Validate the current node
//   if (!node || !node.id || !node.name) {
//     console.warn('Invalid node detected:', node);
//     return { nodes, edges };
//   }

//   // Add the current node
//   const currentNode: Node = {
//     id: node.id,
//     data: { label: node.name },
//     position: { x: Math.random() * 200, y: Math.random() * 200 },
//   };

//   nodes.push(currentNode);

//   // Add edge if there is a parent
//   if (parentId) {
//     const currentEdge: Edge = {
//       id: `e${parentId}-${node.id}`,
//       source: parentId,
//       target: node.id,
//     };

//     edges.push(currentEdge);
//   }

//   // Recurse through children
//   if (node.children && node.children.length > 0) {
//     node.children.forEach((child) =>
//       generateNodesAndEdges(child, node.id, nodes, edges)
//     );
//   }

//   return { nodes, edges };
// };


// import { Node, Edge } from 'react-flow-renderer';

// interface TreeNode {
//   id: string;
//   name: string;
//   children?: TreeNode[];
// }

// export const generateNodesAndEdges = (
//   node: TreeNode,
//   parentId: string | null = null,
//   nodes: Node[] = [],
//   edges: Edge[] = []
// ) => {
//   // Validate the current node
//   if (!node || !node.id || !node.name) {
//     console.warn('Invalid node detected:', node);
//     return { nodes, edges };
//   }

//   // Add the current node
//   const currentNode: Node = {
//     id: node.id,
//     data: { label: node.name },
//     position: { x: Math.random() * 200, y: Math.random() * 200 },
//   };

//   nodes.push(currentNode);

//   // Add edge if there is a parent
//   if (parentId) {
//     const currentEdge: Edge = {
//       id: `e${parentId}-${node.id}`,
//       source: parentId,
//       target: node.id,
//     };

//     edges.push(currentEdge);
//   }

//   // Recurse through children
//   if (node.children && node.children.length > 0) {
//     node.children.forEach((child) =>
//       generateNodesAndEdges(child, node.id, nodes, edges)
//     );
//   }

//   return { nodes, edges }

// };


// import { Node, Edge } from 'react-flow-renderer';

// interface TreeNode {
//   id: string;
//   name: string;
//   children?: TreeNode[];
// }

// export const generateNodesAndEdges = (
//   tree: TreeNode,
//   parentId: string | null = null,
//   nodes: Node[] = [],
//   edges: Edge[] = []
// ) => {
//   if (!tree || !tree.id || !tree.name) {
//     console.warn('Invalid tree node:', tree);
//     return { nodes, edges };
//   }

//   // Add the current node
//   const nodeId = tree.id;
//   nodes.push({
//     id: nodeId,
//     data: { label: tree.name },
//     position: { x: 0, y: 0 }, // Temporary position, will be updated by layout
//   });

//   // Add edge to the parent
//   if (parentId) {
//     edges.push({
//       id: `e${parentId}-${nodeId}`,
//       source: parentId,
//       target: nodeId,
//       animated: false,
//     });
//   }

//   // Recursively process children
//   tree.children?.forEach((child) => {
//     generateNodesAndEdges(child, nodeId, nodes, edges);
//   });

//   return { nodes, edges };
// };


import { Node, Edge } from 'react-flow-renderer';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export const generateNodesAndEdges = (
  tree: TreeNode,
  parentId: string | null = null,
  nodes: Node[] = [],
  edges: Edge[] = []
) => {
  if (!tree || !tree.id || !tree.name) {
    console.warn('Invalid tree node:', tree);
    return { nodes, edges };
  }

  const nodeId = tree.id;

  // Add the current node
  const node = {
    id: nodeId,
    data: { label: tree.name },
    position: { x: 0, y: 0 }, // Placeholder for layout
  };
  nodes.push(node);

  // Add edge to the parent
  if (parentId) {
    const edge = {
      id: `e${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
    };
    edges.push(edge);
  }

  // Recursively process children
  tree.children?.forEach((child) => generateNodesAndEdges(child, nodeId, nodes, edges));

  return { nodes, edges };
};