import { Position, Handle } from '@xyflow/react';

function EventNode({ data }) {
  const description = data?.description?.trim();
  const severity = Number.isFinite(data?.severity)
    ? data.severity
    : 0;

  return (
    <div
      className="event-node"
      title={[
        'Event',
        `Description: ${description || 'Not set'}`,
        `Severity: ${severity.toFixed(1)}`,
      ].join('\n')}
    >
      <div style={{ background: 'none', fontSize: 25 }}>
        <label>ζ</label>
      </div>

      <Handle
        position={Position.Right}
        style={{
          background: 'none',
          border: 'none',
          width: '85%',
          height: '30%',
          transform: 'translateY(-30%) translateX(-5%)',
        }}
      />
    </div>
  );
}

export default EventNode;