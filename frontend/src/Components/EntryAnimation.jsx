import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Lottie from "lottie-react";
import cricketAnimation from "../assets/cricket.json";

/* ---------- Animations ---------- */

// leaves like a material dissolving: fade + slight scale + blur together
const fadeOut = keyframes`
  to {
    opacity: 0;
    transform: scale(1.03);
    filter: blur(8px);
  }
`;

/* ---------- Styled ---------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background:
    radial-gradient(40rem 30rem at 50% 40%, var(--bg-tint-1), transparent 70%),
    var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${({ $exit }) => ($exit ? fadeOut : "none")} 0.35s var(--ease) forwards;
`;

const AnimationWrapper = styled.div`
  width: min(420px, 85vw);
  max-height: 70vh;
`;

/* ---------- Component ---------- */

const EntryAnimation = ({ onFinish }) => {
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
    <Overlay $exit={exit}>
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
