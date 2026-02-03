import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Banner = styled.div`
font-family: "Inter", sans-serif;
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ online }) => (online ? "#16a34a" : "#dc2626")};
  color: white;
  z-index: 9999;
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

  if (online) return null;

  return <Banner online={false}>You are offline!</Banner>;
};

export default NetworkBanner;
