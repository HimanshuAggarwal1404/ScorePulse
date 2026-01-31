import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  width: 100%;
  max-width: 30vw;
  max-height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-radius: 10px;
  padding: 10px;
  // position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(56, 189, 248, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(56, 189, 248, 0.8) 50%, 
      transparent 100%
    );
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  &:hover {
  cursor: pointer;
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.6);
  }
`;

const MatchType = styled.div`
display: flex;
height: 10%;
  font-size: clamp(10px, 2vw, 14px);
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #38bdf8;
  font-weight: 600;
  margin-bottom: clamp(8px, 5%, 16px);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #ef4444;
    border-radius: 50%;
    box-shadow: 0 0 10px #ef4444;
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const MatchContent = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  flex-direction: row;
  overflow: hidden;  align-items: center;
  justify-content: space-between;
  gap: clamp(12px, 4%, 24px);
  flex: 1;
  min-height: 0;
`;

const TeamsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(12px, 5%, 20px);
  min-height: 0;
`;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(10px, 3%, 16px);
  flex-shrink: 0;
`;

const FlagPlaceholder = styled.div`
  width: clamp(36px, 10%, 52px);
  aspect-ratio: 1;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 2px solid rgba(56, 189, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(18px, 4vw, 28px);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
    border-color: rgba(56, 189, 248, 0.6);
  }
`;

const TeamName = styled.div`
  font-size: clamp(14px, 3vw, 22px);
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ScoresSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(12px, 5%, 20px);
  flex-shrink: 0;
  min-height: 0;
`;

const Score = styled.div`
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
  border: 2px solid rgba(56, 189, 248, 0.4);
  border-radius: 12px;
  padding: clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px);
  text-align: center;
  font-size: clamp(20px, 5vw, 32px);
  font-weight: 800;
  color: #38bdf8;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%);
    border-color: rgba(56, 189, 248, 0.8);
    text-shadow: 0 0 30px rgba(56, 189, 248, 0.8);
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(56, 189, 248, 0.3) 50%, 
    transparent 100%
  );
  flex-shrink: 0;
`;

const ResultSection = styled.div`
  margin-top: auto;
  height: 10%;
  padding-top: clamp(8px, 3%, 12px);
  border-top: 1px solid rgba(56, 189, 248, 0.2);
  text-align: center;
  font-size: clamp(11px, 2vw, 14px);
  font-weight: 600;
  color: #ef4444;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  animation: glow 2s ease-in-out infinite;
  flex-shrink: 0;

  @keyframes glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`;

const MatchCard = ({ matchData }) => {
  // Default sample data if no props provided
  const defaultData = {
    type: "T20 International",
    live: false,
    team1: {
      name: "India",
      flag: "🇮🇳",
      score: "187",
      wickets: "4"
    },
    team2: {
      name: "Australia",
      flag: "🇦🇺",
      score: "142",
      wickets: "7"
    },
    status: "second_innings",
    result: null,
    runsToWin: 46
  };

  const data = matchData || defaultData;

  // Determine what to show in the result section
  const getResultText = () => {
    if (data.result) {
      return data.result;
    }
    if (data.status === "second_innings" && data.runsToWin) {
      return `${data.runsToWin} runs needed to win`;
    }
    return null;
  };

  const resultText = getResultText();

  return (
    <CardContainer>
      <MatchType>{data.type} <span style={{ textTransform: 'none' }}>{data.live ? " • Live" : "   • Concluded"}</span></MatchType>
      <MatchContent>
        <TeamsSection>
          <TeamRow>
            <FlagPlaceholder>{data.team1.flag}</FlagPlaceholder>
            <TeamName>{data.team1.name}</TeamName>
          </TeamRow>
          <Separator />
          <TeamRow>
            <FlagPlaceholder>{data.team2.flag}</FlagPlaceholder>
            <TeamName>{data.team2.name}</TeamName>
          </TeamRow>
        </TeamsSection>
        <ScoresSection>
          <Score>{data.team1.score}/{data.team1.wickets}</Score>
          <Score>{data.team2.score}/{data.team2.wickets}</Score>
        </ScoresSection>
      </MatchContent>
      {resultText && <ResultSection>{resultText}</ResultSection>}
    </CardContainer>
  )
}

export default MatchCard