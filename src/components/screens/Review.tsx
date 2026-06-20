import { useMemo, useState } from "react";
import TabHeader from "./TabHeader";
import { buildDeck, grade, totalWords, type ReviewCard } from "../../lib/review";
import { gloss } from "../../lib/journal/store";
import type { JournalEntry } from "../../types";

interface ReviewProps {
  onTab: (tab: "journal" | "records" | "review") => void;
  onPlay: (entry: JournalEntry) => void;
}

export default function Review({ onTab, onPlay }: ReviewProps) {
  const initialDue = useMemo(() => buildDeck(false), []);
  const total = useMemo(() => totalWords(), []);

  const [queue, setQueue] = useState<ReviewCard[]>(initialDue);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [done, setDone] = useState(initialDue.length === 0);

  const startPractice = () => {
    const all = buildDeck(true);
    if (all.length === 0) return;
    setQueue(all);
    setReviewed(0);
    setRevealed(false);
    setDone(false);
  };

  const onGrade = (knew: boolean) => {
    const card = queue[0];
    if (!card) return;
    grade(card.entry.word, knew);
    setReviewed((n) => n + 1);
    setRevealed(false);
    setQueue((q) => {
      const rest = q.slice(1);
      const next = knew ? rest : [...rest, card]; // missed cards loop back
      if (next.length === 0) setDone(true);
      return next;
    });
  };

  const card = queue[0];

  return (
    <div
      className="fade-up"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TabHeader
        active="review"
        onTab={onTab}
        meta={done ? "spaced repetition" : `${reviewed} done · ${queue.length} left`}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(28px, 5vw, 56px)",
          textAlign: "center",
        }}
      >
        {/* Empty: no words at all */}
        {total === 0 && (
          <div style={{ color: "#76736c", maxWidth: 380 }}>
            <div
              style={{ font: "400 clamp(28px,5vw,40px) Fraunces,serif", color: "#cfccc3" }}
            >
              Nothing to review yet
            </div>
            <div style={{ font: "400 16px/1.5 'Hanken Grotesk'", marginTop: 14 }}>
              Look up some words in a reading session and they’ll show up here as
              flashcards.
            </div>
          </div>
        )}

        {/* Caught up */}
        {total > 0 && done && (
          <div style={{ color: "#9c998f", maxWidth: 420 }}>
            <div
              style={{ font: "400 clamp(30px,5vw,46px) Fraunces,serif", color: "#f1eee6" }}
            >
              All caught up ✦
            </div>
            <div style={{ font: "400 16px/1.5 'Hanken Grotesk'", marginTop: 14 }}>
              {reviewed > 0
                ? `You reviewed ${reviewed} ${reviewed === 1 ? "card" : "cards"}. Come back later for the next round.`
                : "No cards are due right now."}
            </div>
            <button
              onClick={startPractice}
              style={{
                marginTop: 28,
                cursor: "pointer",
                font: "600 15px 'Hanken Grotesk'",
                color: "#211803",
                background: "var(--accent)",
                border: "none",
                borderRadius: 40,
                padding: "13px 30px",
                boxShadow: "0 12px 36px rgba(216,177,90,.28)",
              }}
            >
              Practice all {total} words
            </button>
          </div>
        )}

        {/* Active card */}
        {card && !done && (
          <div style={{ width: "100%", maxWidth: 720 }}>
            <div
              style={{
                font: "600 12px 'Hanken Grotesk'",
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "#7c7a73",
                marginBottom: 24,
              }}
            >
              {revealed ? "do you know it?" : "recall the meaning"}
            </div>

            <div
              style={{
                font: "500 clamp(44px, 9vw, 96px)/.98 Fraunces,serif",
                color: "#f4f1e9",
                letterSpacing: "-.01em",
                wordBreak: "break-word",
              }}
            >
              {card.entry.word}
            </div>

            {revealed ? (
              <div style={{ marginTop: 26 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "baseline",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {card.entry.pronunciation && (
                    <span
                      style={{
                        font: "italic 400 clamp(18px,3vw,24px) Fraunces",
                        color: "var(--accent)",
                      }}
                    >
                      {card.entry.pronunciation}
                    </span>
                  )}
                  {card.entry.partOfSpeech && (
                    <span
                      style={{
                        font: "600 12px 'Hanken Grotesk'",
                        letterSpacing: ".2em",
                        textTransform: "uppercase",
                        color: "#8d8a80",
                      }}
                    >
                      {card.entry.partOfSpeech}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    font: "400 clamp(20px,3.4vw,30px)/1.3 'Hanken Grotesk'",
                    color: "#eae7de",
                    marginTop: 16,
                  }}
                >
                  {card.entry.definition}
                </div>
                {card.entry.example && (
                  <div
                    style={{
                      font: "italic 400 clamp(16px,2.6vw,22px)/1.3 Fraunces",
                      color: "#9d9990",
                      marginTop: 14,
                    }}
                  >
                    “{card.entry.example}”
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "center",
                    marginTop: 34,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => onGrade(false)}
                    style={{
                      cursor: "pointer",
                      font: "600 15px 'Hanken Grotesk'",
                      color: "#e08a6a",
                      background: "rgba(224,138,106,.1)",
                      border: "1px solid rgba(224,138,106,.4)",
                      borderRadius: 12,
                      padding: "13px 26px",
                    }}
                  >
                    Forgot
                  </button>
                  <button
                    onClick={() => onGrade(true)}
                    style={{
                      cursor: "pointer",
                      font: "600 15px 'Hanken Grotesk'",
                      color: "#211803",
                      background: "var(--accent)",
                      border: "none",
                      borderRadius: 12,
                      padding: "13px 30px",
                      boxShadow: "0 10px 30px rgba(216,177,90,.26)",
                    }}
                  >
                    Knew it
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  marginTop: 34,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setRevealed(true)}
                  style={{
                    cursor: "pointer",
                    font: "600 16px 'Hanken Grotesk'",
                    color: "#f1eee6",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.14)",
                    borderRadius: 40,
                    padding: "14px 34px",
                  }}
                >
                  Reveal definition
                </button>
                <button
                  onClick={() => onPlay(card.entry)}
                  title="hear it"
                  style={{
                    cursor: "pointer",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    color: "var(--accent)",
                    background: "transparent",
                    border: "1px solid rgba(216,177,90,.4)",
                    fontSize: 15,
                  }}
                >
                  ▷
                </button>
              </div>
            )}

            <div
              style={{
                font: "400 13px 'Hanken Grotesk'",
                color: "#5c594f",
                marginTop: 30,
              }}
            >
              {gloss(card.entry).split(" · ")[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
