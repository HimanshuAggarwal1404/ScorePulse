// Latest cricket headlines (ESPNcricinfo, via /api/news) laid out like a front
// page: a lead story, a column of headlines, and more on demand.
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { apiGet } from "../api";
import { Button, Muted, SectionTitle, Skeleton } from "../ui/kit";
import { glass, pressable } from "../ui/styles";

const SIDE_COUNT = 5;
const MORE_COUNT = 9;

/* ---------- LAYOUT ---------- */

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

const Front = styled.div`
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Lead = styled.a`
  ${glass}
  ${pressable}
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  color: var(--text);
  text-decoration: none;

  @media (hover: hover) {
    &:hover img {
      transform: scale(1.03);
    }
    &:hover h3 {
      color: var(--accent);
    }
  }
`;

const LeadBody = styled.div`
  padding: 1.1rem 1.25rem 1.25rem;

  h3 {
    font-size: clamp(1.2rem, 2.2vw, 1.5rem);
    font-weight: 700;
    line-height: 1.22;
    letter-spacing: -0.02em;
    text-wrap: balance;
    transition: color var(--quick) var(--ease);
  }
  p {
    margin-top: 0.5rem;
    color: var(--text-2);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Side = styled.div`
  ${glass}
  border-radius: var(--radius-lg);
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
`;

const Row = styled.a`
  display: grid;
  grid-template-columns: ${({ $thumb }) => $thumb || "104px"} 1fr;
  gap: 0.85rem;
  align-items: center;
  padding: 0.6rem;
  border-radius: 16px;
  color: var(--text);
  text-decoration: none;
  transition: background-color var(--quick) var(--ease);

  & + & {
    border-top: 1px solid var(--border);
  }
  ${({ $fill }) => $fill && "flex: 1;"}
  @media (hover: hover) {
    &:hover {
      background: var(--hover);
    }
    &:hover h4 {
      color: var(--accent);
    }
  }
  h4 {
    font-size: 0.92rem;
    font-weight: 650;
    line-height: 1.32;
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color var(--quick) var(--ease);
  }
`;

const More = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.25rem 1rem;
  margin-top: 1rem;

  ${Row} + ${Row} {
    border-top: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.1rem;

  a {
    color: var(--muted);
    font-size: 0.8rem;
    text-decoration: none;
  }
  a:hover {
    color: var(--accent);
  }
`;

const Meta = styled.div`
  margin-top: ${({ $gap }) => $gap || "0.35rem"};
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--muted);
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  /* the lead photo grows so the story matches the headline column's height */
  ${({ $fill }) =>
    $fill &&
    `
    flex: 1 1 auto;
    min-height: 240px;
    aspect-ratio: auto;
    @media (max-width: 900px) {
      flex: none;
      aspect-ratio: 16 / 9;
    }
  `}
  overflow: hidden;
  border-radius: ${({ $round }) => ($round ? "12px" : 0)};
  background:
    radial-gradient(closest-side at 30% 40%, var(--accent-soft), transparent),
    linear-gradient(135deg, var(--solid-2), var(--solid));
  display: grid;
  place-items: center;
  font-size: ${({ $round }) => ($round ? "1.2rem" : "2.5rem")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms var(--ease);
  }
`;

/* ---------- PIECES ---------- */

// Photo with a branded placeholder if it is missing or fails to load.
const Photo = ({ src, ratio, round, fill }) => {
  const [failed, setFailed] = useState(false);
  return (
    <Media $ratio={ratio} $round={round} $fill={fill}>
      {src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span aria-hidden>🏏</span>}
    </Media>
  );
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const external = { target: "_blank", rel: "noopener noreferrer" };

const Headline = ({ article, thumb = "104px", fill }) => (
  <Row href={article.url} {...external} $thumb={thumb} $fill={fill}>
    <Photo src={article.thumbnail} ratio="3 / 2" round />
    <div style={{ minWidth: 0 }}>
      <h4>{article.title}</h4>
      <Meta>{timeAgo(article.publishedAt)}</Meta>
    </div>
  </Row>
);

/* ---------- SECTION ---------- */

const NewsSection = () => {
  const [news, setNews] = useState(null);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    apiGet(`/news?limit=${1 + SIDE_COUNT + MORE_COUNT}`)
      .then((d) => setNews(d.articles || []))
      .catch(() => setFailed(true));
  }, []);

  // no feed, no section: better than an empty box on the home page
  if (failed || news?.length === 0) return null;

  const [lead, ...others] = news || [];
  const side = others.slice(0, SIDE_COUNT);
  const more = others.slice(SIDE_COUNT);

  return (
    <section>
      <Head>
        <SectionTitle>Latest news</SectionTitle>
        <Muted $size="0.78rem">from ESPNcricinfo</Muted>
      </Head>

      {!news ? (
        <Front>
          <Skeleton $h="430px" $r="22px" />
          <Skeleton $h="430px" $r="22px" />
        </Front>
      ) : (
        <>
          <Front>
            <Lead href={lead.url} {...external}>
              <Photo src={lead.image} ratio="16 / 9" fill />
              <LeadBody>
                <h3>{lead.title}</h3>
                {lead.summary && <p>{lead.summary}</p>}
                <Meta $gap="0.75rem">ESPNcricinfo · {timeAgo(lead.publishedAt)}</Meta>
              </LeadBody>
            </Lead>
            <Side>
              {side.map((a) => (
                <Headline key={a.id} article={a} fill />
              ))}
            </Side>
          </Front>

          {expanded && (
            <More>
              {more.map((a) => (
                <Headline key={a.id} article={a} thumb="84px" />
              ))}
            </More>
          )}

          <Footer>
            {more.length > 0 && (
              <Button $variant="ghost" $size="sm" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
                {expanded ? "Show less" : "More news"}
              </Button>
            )}
            <a href="https://www.espncricinfo.com/cricket-news" {...external}>
              All news on ESPNcricinfo ↗
            </a>
          </Footer>
        </>
      )}
    </section>
  );
};

export default NewsSection;
