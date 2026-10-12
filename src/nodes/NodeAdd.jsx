import { Plus } from "lucide-react";
import {
  Position,
  useConnection,
  useReactFlow,
} from "@xyflow/react";

import { ButtonHandle } from "@/components/button-handle";
import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { Button } from "@/components/ui/button";

const selector = (c) => c.inProgress;

export default function AddNode({ id }) {
  const connectionInProgress = useConnection(selector);

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

const onClick = () => {
  const newId = crypto.randomUUID();

  const nodes = getNodes();
  const edges = getEdges();

  const addNode = nodes.find((n) => n.id === id);
  if (!addNode) return;

  // Find last node connected to Add
  const incoming = edges.find((e) => e.target === id);
  const lastNodeId = incoming?.source;

  // Create new Event at current Add position
  const newNode = {
    id: newId,
    type: "Event",
    position: {
      x: addNode.position.x,
      y: addNode.position.y,
    },
    data: {},
  };

  let updatedEdges = [...edges];

  // Replace connection to Add node to a connection to new Event node
  if (lastNodeId) {
    updatedEdges = updatedEdges.filter(
      (e) => !(e.source === lastNodeId && e.target === id)
    );

    // 
    updatedEdges.push({
      id: `e-${lastNodeId}-${newId}`,
      source: lastNodeId,
      target: newId,
      type: "straight-edge",
    });
  }

  // Re-connect Add node back to the latest Event node
  updatedEdges.push({
    id: `e-${newId}-${id}`,
    source: newId,
    target: id,
    type: "straight-edge",
  });

  // Move Add node along
  setNodes((nds) => nds.concat(newNode));
  setNodes((nds) =>
    nds.map((n) =>
      n.id === id
        ? {
            ...n,
            position: {
              x: n.position.x + 100,
              y: n.position.y,
            },
          }
        : n
    )
  );

  setEdges(updatedEdges);
};

  return (
    <BaseNode>
      <BaseNodeContent>
      <Button onClick={onClick} size="sm">
            <Plus size={10} />
      </Button>
        <ButtonHandle
          type="source"
          position={Position.Left}
          showButton={!connectionInProgress}
        >
          
        </ButtonHandle>
      </BaseNodeContent>
    </BaseNode>
  );
}