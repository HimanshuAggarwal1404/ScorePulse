import React from 'react'
import styled from 'styled-components'
import Header from '../Components/Header'

const ErrorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2433 0%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const ErrorContent = styled.div`
  text-align: center;
  max-width: 600px;
`;

const ErrorCode = styled.h1`
  font-size: 10rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #b0b8c1;
  margin: 1.5rem 0 2.5rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.a`
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${props => props.primary ? `
    background-color: #4a90e2;
    color: white;
    
    &:hover {
      background-color: #357abd;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
    }
  ` : `
    background-color: transparent;
    color: #ffffff;
    border: 2px solid #4a90e2;
    
    &:hover {
      background-color: rgba(74, 144, 226, 0.1);
      transform: translateY(-2px);
    }
  `}
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ErrorPage = () => {
  return (
    <>
      {/* <Header /> */}
      <ErrorContainer>
        <ErrorContent>
          <IconWrapper>🏏</IconWrapper>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>Page Not Found</ErrorTitle>
          <ErrorMessage>
            Looks like this page got a red card! The page you're looking for doesn't exist or has been moved.
          </ErrorMessage>
          <ButtonGroup>
            <Button href="/" primary>Go Home</Button>
            <Button href="/Live Scores">Live Scores</Button>
          </ButtonGroup>
        </ErrorContent>
      </ErrorContainer>
    </>
  )
}

export default ErrorPage