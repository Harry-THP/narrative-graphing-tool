import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EventNode from './nodes/NodeEvent';
import StraightEdge from './edges/EdgeStraight';

const initialNodes = [
  {
    id: 'n1',
    type: 'Event',
    data: { value: 'Node 1', label: 'Node 1 Custom'},
    position: { x: 0, y: 0 },
  },
  {
    id: 'n2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];

const nodeTypes = { Event: EventNode };

const initialEdges = [
  { id: 'a->b', type: 'custom-edge', source: 'n1', target: 'n2' },
];

const edgeTypes = {
  'straight-edge': StraightEdge,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={{ type: "straight-edge" }}
        connectionMode="Loose"
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
