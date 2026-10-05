import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { glass } from "../ui/styles";

const Banner = styled.div`
  ${glass}
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  font-family: var(--font);
  font-size: 0.86rem;
  font-weight: 650;
  color: var(--text);
  border-color: var(--live);
  box-shadow: var(--shadow-lg);
  /* rises from the bottom edge and leaves the same way */
  transform: translate(-50%, ${({ $show }) => ($show ? "0" : "calc(100% + 2rem)")});
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: transform var(--settle) var(--ease), opacity var(--quick) var(--ease);

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--live);
    box-shadow: 0 0 10px var(--live);
  }
`;

const NetworkBanner = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <Banner $show={!online} role="status" aria-hidden={online}>
      You're offline - scores will update when you reconnect
    </Banner>
  );
};

export default NetworkBanner;
