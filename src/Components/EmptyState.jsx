import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Wrap = styled.div`
  padding: 48px 24px;
  text-align: center;
  border-radius: 14px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
`;

const Icon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.textPrimary};
`;

const Text = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 16px;
`;

const Action = styled(Link)`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.highlight};
  color: #fff;
  font-weight: 600;
  text-decoration: none;
`;

const EmptyState = ({ icon, title, text, actionLabel, actionTo }) => {
  const { darkMode } = useTheme();

  const theme = {
    cardBg: darkMode ? "#151c2f" : "#ffffff",
    border: darkMode ? "#24304a" : "#e5e7eb",
    textPrimary: darkMode ? "#f5f7fa" : "#0f172a",
    textMuted: darkMode ? "#9aa4b2" : "#64748b",
    highlight: darkMode ? "#60a5fa" : "#2563eb",
  };

  return (
    <Wrap theme={theme}>
      <Icon>{icon}</Icon>
      <Title theme={theme}>{title}</Title>
      <Text theme={theme}>{text}</Text>
      {actionLabel && <Action to={actionTo} theme={theme}>{actionLabel}</Action>}
    </Wrap>
  );
};

export default EmptyState;
