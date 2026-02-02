import React, { useEffect } from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import { useTheme } from "../context/ThemeContext";


import cricketAnimation from "../assets/cricket.json";


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: ${({ dark }) => (dark ? "#0b1220" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimationWrapper = styled.div`
  width: 40vw;
  max-width: 80vw;
`;

/* ---------- Component ---------- */

const EntryAnimation = ({ onFinish }) => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onFinish, 1300); // match animation length
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Overlay dark={darkMode}>
      <AnimationWrapper>
        <Lottie
          animationData={cricketAnimation}
          loop={false}
          autoplay
        />
      </AnimationWrapper>
    </Overlay>
  );
};

export default EntryAnimation;
