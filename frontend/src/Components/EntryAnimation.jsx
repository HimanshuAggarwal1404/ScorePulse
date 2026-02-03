import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Lottie from "lottie-react";
import { useTheme } from "../context/ThemeContext";
import cricketAnimation from "../assets/cricket.json";

/* ---------- Animations ---------- */

const fadeOut = keyframes`
  to {
    opacity: 0;
    transform: scale(0.96);
  }
`;

/* ---------- Styled ---------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: ${({ dark }) => (dark ? "#0b1220" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${({ exit }) => (exit ? fadeOut : "none")} 0.35s ease forwards;
`;

const AnimationWrapper = styled.div`
  width: min(420px, 85vw);
  max-height: 70vh;
`;

/* ---------- Component ---------- */

const EntryAnimation = ({ onFinish }) => {
  const { darkMode } = useTheme();
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Safety fallback in case animation fails
    const fallback = setTimeout(() => {
      setExit(true);
      setTimeout(onFinish, 350);
    }, 1600);

    return () => clearTimeout(fallback);
  }, [onFinish]);

  return (
    <Overlay dark={darkMode} exit={exit}>
      <AnimationWrapper>
        <Lottie
          animationData={cricketAnimation}
          loop={false}
          autoplay
          onComplete={() => {
            setExit(true);
            setTimeout(onFinish, 350);
          }}
        />
      </AnimationWrapper>
    </Overlay>
  );
};

export default EntryAnimation;
