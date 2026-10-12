import { Position, Handle } from '@xyflow/react';

function ActionNode({ data }) {
  const characterColor = data?.characterColor || 'inherit';
  const description = data?.description?.trim();
  const severity = Number.isFinite(data?.severity)
    ? data.severity
    : 0;

  const tooltip = [
    'Action',
    `Description: ${description || 'Not set'}`,
    `Character: ${data?.characterName || 'Not set'}`,
    `Severity: ${severity.toFixed(1)}`,
  ].join('\n');

  return (
    <div
      className="action-node"
      title={tooltip}
    >
      <div style={{ background: 'none', fontSize: 25 }}>
        <label style={{ color: characterColor }}>α</label>
      </div>

      <Handle
        id="action-target"
        type="target"
        position={Position.Left}
        style={{
          background: 'none',
          border: 'none',
          width: '20%',
          height: '30%',
        }}
      />

      <Handle
        id="action-source"
        type="source"
        position={Position.Right}
        style={{
          background: 'none',
          border: 'none',
          width: '20%',
          height: '30%',
        }}
      />
    </div>
  );
}

export default ActionNode;