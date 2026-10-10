// Player components shared by the players pages, team pages and the scorer.
import React, { useState } from "react";
import styled from "styled-components";
import { initials } from "./styles";
import { teamColor } from "./playerStats";

export const TeamMono = styled.span`
  display: inline-grid;
  place-items: center;
  flex: none;
  min-width: ${({ $size }) => $size || "2.1rem"};
  height: ${({ $size }) => $size || "2.1rem"};
  padding: 0 0.3rem;
  border-radius: 10px;
  font-size: ${({ $small }) => ($small ? "0.62rem" : "0.68rem")};
  font-weight: 800;
  letter-spacing: 0.03em;
  color: ${({ $code }) => teamColor($code)};
  background: ${({ $code }) => `color-mix(in srgb, ${teamColor($code)} 14%, transparent)`};
  border: 1px solid ${({ $code }) => `color-mix(in srgb, ${teamColor($code)} 38%, transparent)`};
`;

/* ------------------------------------------------------------------ */
/* PHOTO                                                               */
/* ------------------------------------------------------------------ */

const PhotoRing = styled.div`
  position: relative;
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: ${({ $color }) => `linear-gradient(160deg, color-mix(in srgb, ${$color} 30%, var(--solid-2)), var(--solid-2))`};
  box-shadow: 0 0 0 2px ${({ $color }) => `color-mix(in srgb, ${$color} 55%, transparent)`},
    inset 0 1px 0 var(--glass-highlight);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }
  span {
    font-weight: 750;
    font-size: ${({ $size }) => Math.round($size * 0.32)}px;
    letter-spacing: 0.02em;
    color: ${({ $color }) => $color};
  }
`;

// Headshot with an initials fallback (missing image or the request fails).
export const PlayerPhoto = ({ src, name, size = 56, code, className }) => {
  const [failed, setFailed] = useState(false);
  return (
    <PhotoRing $size={size} $color={teamColor(code)} className={className}>
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <span>{initials(name)}</span>
      )}
    </PhotoRing>
  );
};

/* ------------------------------------------------------------------ */
/* TEAM LOGO                                                           */
/* ------------------------------------------------------------------ */

const LogoBox = styled.span`
  display: inline-grid;
  place-items: center;
  flex: none;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  border-radius: ${({ $crest }) => ($crest ? "0" : "8px")};
  overflow: hidden;
  box-shadow: ${({ $crest }) => ($crest ? "none" : "0 0 0 1px var(--border), 0 2px 8px -2px rgba(0, 0, 0, 0.35)")};

  img {
    width: 100%;
    height: 100%;
    object-fit: ${({ $crest }) => ($crest ? "contain" : "cover")};
    filter: ${({ $crest }) => ($crest ? "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))" : "none")};
  }
`;

// Flag (international / state sides) or crest (franchises), falling back to
// the team's monogram. `crest` keeps the whole image; flags are cropped to fit.
export const TeamLogo = ({ src, code, size = 40, crest = false, label }) => {
  const [failed, setFailed] = useState(false);
  const w = crest ? size : Math.round(size * 1.33);
  if (!src || failed) {
    return (
      <TeamMono $code={code} $size={`${size}px`} $small={size < 34} title={label}>
        {code}
      </TeamMono>
    );
  }
  return (
    <LogoBox $w={w} $h={size} $crest={crest} title={label}>
      <img src={src} alt={label ? `${label} logo` : ""} loading="lazy" onError={() => setFailed(true)} />
    </LogoBox>
  );
};
