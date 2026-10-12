import { useState, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import AddNode from './nodes/NodeAdd';
import EventNode from './nodes/NodeEvent';
import ActionNode from './nodes/NodeAction';
import StraightEdge from './edges/EdgeStraight';
import NodeEditorPopup from './NodeEditorPopup';

const initialNodes = [
  {
    id: 'e1',
    type: 'Event',
    data: {
      value: 'Node 1',
      label: 'Node 1 Custom',
      description: '',
      severity: 0,
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'A',
    position: { x: 100, y: 0 },
    data: { label: 'Node' },
    type: 'Add',
  },
];

const initialEdges = [
  {
    id: 'a->b',
    type: 'straight-edge',
    source: 'e1',
    target: 'A',
  },
];

const nodeTypes = {
  Event: EventNode,
  Action: ActionNode,
  Add: AddNode,
};

const edgeTypes = {
  'straight-edge': StraightEdge,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Characters belong to this project's current state.
  const [characters, setCharacters] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const { screenToFlowPosition } = useReactFlow();

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) ?? null;

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        { ...params, type: 'straight-edge' },
        eds,
      ),
    );
  }, []);

  const onNodeClick = useCallback((event, node) => {
    if (node.type === 'Event' || node.type === 'Action') {
      setSelectedNodeId(node.id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  const updateSelectedNode = useCallback(
    (updates) => {
      if (!selectedNodeId) return;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...updates,
                },
              }
            : node,
        ),
      );
    },
    [selectedNodeId],
  );

  const addCharacter = useCallback((character) => {
    setCharacters((current) => [...current, character]);
  }, []);

  // Create an Action node when a connection ends on empty canvas.
  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.fromNode || connectionState.toNode) {
        return;
      }

      const { clientX, clientY } =
        'changedTouches' in event
          ? event.changedTouches[0]
          : event;

      const position = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newId = crypto.randomUUID();
      const sourceId = connectionState.fromNode.id;

      setNodes((nds) => [
        ...nds,
        {
          id: newId,
          type: 'Action',
          position,
          data: {
            description: '',
            severity: 0,
            characterId: '',
            characterColor: '',
          },
        },
      ]);

      setEdges((eds) =>
        addEdge(
          {
            id: `e-${sourceId}-${newId}`,
            source: sourceId,
            target: newId,
            type: 'straight-edge',
          },
          eds,
        ),
      );
    },
    [screenToFlowPosition],
  );

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNodeId(null)}
        defaultEdgeOptions={{ type: 'straight-edge' }}
        connectionMode="Loose"
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <NodeEditorPopup
          key={selectedNode.id}
          node={selectedNode}
          onUpdate={updateSelectedNode}
          characters={characters}
          onAddCharacter={addCharacter}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}