import React, { useState } from "react";
import styled from "styled-components";
import { setScorerKey } from "../../api";

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ $t }) => $t.muted};
  min-width: ${({ $min }) => $min || "160px"};
  flex: ${({ $grow }) => ($grow ? 1 : "0 0 auto")};
`;

const control = () => `
  background: var(--solid-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.55rem 0.75rem;
  font-size: 0.92rem;
  font-weight: 500;
  outline: none;
  transition: border-color var(--quick) var(--ease), box-shadow var(--quick) var(--ease);
  &:focus { border-color: var(--accent-line); box-shadow: 0 0 0 4px var(--accent-soft); }
  &:disabled { opacity: 0.6; }
`;

export const Input = styled.input`
  ${control}
`;

export const Select = styled.select`
  ${control}
`;

export const TextArea = styled.textarea`
  ${control}
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
`;

export const Button = styled.button`
  border: 1px solid ${({ $variant }) => ($variant === "ghost" ? "var(--border)" : "transparent")};
  background: ${({ $variant }) => ($variant === "ghost" ? "var(--hover)" : $variant === "danger" ? "var(--live)" : "var(--accent)")};
  color: ${({ $variant }) => ($variant === "ghost" ? "var(--text)" : $variant === "danger" ? "#fff" : "var(--accent-ink)")};
  box-shadow: ${({ $variant }) => (!$variant ? "var(--glow)" : "none")};
  border-radius: 999px;
  padding: 0.6rem 1.1rem;
  font-weight: 650;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
  transition: transform var(--press) var(--ease), filter var(--quick) var(--ease);

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.div`
  color: ${({ $t }) => $t.wicket};
  background: ${({ $t }) => $t.liveSoft};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.86rem;
  font-weight: 600;
  margin: 8px 0;
`;

export const Check = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  cursor: pointer;
  user-select: none;
`;

// Shown when the backend has SCORER_KEY set and we don't have it yet.
export const KeyPrompt = ({ t, onSaved }) => {
  const [key, setKey] = useState("");
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", margin: "10px 0" }}>
      <Field $t={t} $min="260px">
        Scorer key (SCORER_KEY in backend/.env)
        <Input $t={t} type="password" value={key} onChange={(e) => setKey(e.target.value)} />
      </Field>
      <Button
        $t={t}
        onClick={() => {
          setScorerKey(key.trim());
          onSaved?.();
        }}
      >
        Save key
      </Button>
    </div>
  );
};

export const ActionError = ({ error, t, onKeySaved }) => {
  if (!error) return null;
  if (error.status === 401) return <KeyPrompt t={t} onSaved={onKeySaved} />;
  return <ErrorText $t={t}>{error.message}</ErrorText>;
};
