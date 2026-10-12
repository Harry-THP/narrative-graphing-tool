import { useState } from 'react';

export default function NodeEditorPopup({
  node,
  onUpdate,
  characters,
  onAddCharacter,
  onClose,
}) {
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterColor, setNewCharacterColor] = useState('#64B5F6');

  if (!node) return null;

  const isAction = node.type === 'Action';
  const data = node.data || {};

  const severity = Number.isFinite(data.severity)
    ? data.severity
    : 0;

  function addCharacter() {
    const name = newCharacterName.trim();
    if (!name) return;

    onAddCharacter({
      id: crypto.randomUUID(),
      name,
      color: newCharacterColor,
    });

    setNewCharacterName('');
  }

  return (
    <div
      className="node-editor-popup nodrag nopan"
      onClick={(event) => event.stopPropagation()}
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        width: 280,
        padding: 16,
        borderRadius: 12,
        background: 'var(--panel, white)',
        color: 'var(--panel-foreground, #222)',
        border: '1px solid #ccc',
        boxShadow: '0 4px 20px #0002',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <strong>
          {isAction ? 'Edit Action' : 'Edit Event'}
        </strong>

        <button type="button" onClick={onClose}>
          ✕
        </button>
      </div>

      <label
        htmlFor="node-description"
        style={{ display: 'block', marginBottom: 6 }}
      >
        {isAction ? 'Action Description' : 'Event Description'}
      </label>

      <textarea
        id="node-description"
        className="nodrag"
        value={data.description ?? ''}
        onChange={(event) =>
          onUpdate({ description: event.target.value })
        }
        placeholder="Enter a description..."
        rows={3}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          resize: 'vertical',
          marginBottom: 16,
        }}
      />

      {isAction && (
        <>
          <label
            htmlFor="node-character"
            style={{ display: 'block', marginBottom: 6 }}
          >
            Character
          </label>

          <select
            id="node-character"
            value={data.characterId ?? ''}
            onChange={(event) => {
                const character = characters.find(
                    (item) => item.id === event.target.value
                );

                onUpdate({
                    characterId: character?.id ?? '',
                    characterName: character?.name ?? '',
                    characterColor: character?.color ?? '',
                });
                }}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              marginBottom: 16,
            }}
          >
            <option value="">Choose a character</option>

            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>

          <div
            style={{
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <strong>Project characters</strong>

            {characters.map((character) => (
              <div
                key={character.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: character.color,
                    border: '1px solid #999',
                  }}
                />
                <span>{character.name}</span>
              </div>
            ))}

            {characters.length === 0 && (
              <p style={{ fontSize: 13 }}>
                No characters added yet.
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <input
                value={newCharacterName}
                onChange={(event) =>
                  setNewCharacterName(event.target.value)
                }
                placeholder="New character"
                aria-label="New character name"
                style={{ minWidth: 0, flex: 1 }}
              />

              <input
                type="color"
                value={newCharacterColor}
                onChange={(event) =>
                  setNewCharacterColor(event.target.value)
                }
                aria-label="New character colour"
                title="Choose character colour"
                style={{ width: 36, height: 30 }}
              />
            </div>

            <button
              type="button"
              onClick={addCharacter}
              style={{ marginTop: 8 }}
            >
              Add character
            </button>
          </div>
        </>
      )}

      <label
        htmlFor="node-severity"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span>Severity</span>
        <strong>{severity.toFixed(1)}</strong>
      </label>

      <input
        id="node-severity"
        className="nodrag"
        type="range"
        min="-1"
        max="1"
        step="0.1"
        value={severity}
        onChange={(event) =>
          onUpdate({ severity: Number(event.target.value) })
        }
        style={{ width: '100%' }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
        }}
      >
        <span>-1.0</span>
        <span>0.0</span>
        <span>1.0</span>
      </div>
    </div>
  );
}