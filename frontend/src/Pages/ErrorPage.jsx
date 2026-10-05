import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { Button, ButtonLink, Page } from "../ui/kit";
import { glass } from "../ui/styles";

// arrives like a material: scale + blur + opacity together
const materialize = keyframes`
  from { opacity: 0; transform: scale(0.96); filter: blur(10px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
`;

const Center = styled.div`
  min-height: calc(100vh - var(--header-h));
  display: grid;
  place-items: center;
  padding: 1.5rem;
`;

const Card = styled.div`
  ${glass}
  max-width: 520px;
  width: 100%;
  padding: 3rem 2.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  animation: ${materialize} 420ms var(--ease) both;

  @media (max-width: 600px) {
    padding: 2.25rem 1.5rem;
  }
`;

const Code = styled.div`
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 14vw, 6.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  background: linear-gradient(160deg, var(--text) 30%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 24px var(--accent-soft));
`;

const Heading = styled.h1`
  margin-top: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Message = styled.p`
  margin-top: 0.6rem;
  color: var(--muted);
  line-height: 1.6;
`;

const Actions = styled.div`
  margin-top: 1.75rem;
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <Page>
      <Header />
      <Center>
        <Card>
          <Code>404</Code>
          <Heading>Page not found</Heading>
          <Message>Looks like this page got bowled. The link might be broken, or the page has moved.</Message>
          <Actions>
            <ButtonLink to="/">Go home</ButtonLink>
            <ButtonLink to="/fixtures?type=live" $variant="ghost">
              Live scores
            </ButtonLink>
            <Button $variant="ghost" onClick={goBack}>
              ← Back
            </Button>
          </Actions>
        </Card>
      </Center>
    </Page>
  );
};

export default ErrorPage;
