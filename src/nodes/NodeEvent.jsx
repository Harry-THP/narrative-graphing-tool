import { useCallback } from 'react';
import { Position, Handle } from '@xyflow/react';

function EventNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="event-node">
      <div style={{ background: 'none', fontSize: 25 }}>
        <label htmlFor="text">ζ</label>
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
      ></Handle>
    </div>
  );
}

export default EventNode;
