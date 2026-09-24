"use client";

import { useEffect, useState } from "react";

import { SectionCard } from "@/components/personal/SectionCard";
import {
  fetchPredictions,
  formatPredictionDate,
  summarizePredictions,
  type JeopardyPrediction,
  type PredictionOutcome
} from "@/components/personal/jeopardy-data";
import styles from "./JeopardyPredictionSection.module.css";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; predictions: JeopardyPrediction[] };

const outcomeLabels: Record<PredictionOutcome, string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  pending: "Awaiting result"
};

const outcomeSymbols: Record<PredictionOutcome, string> = {
  correct: "✓",
  incorrect: "×",
  pending: "·"
};

/** Load the current Kaggle predictions independently of the site's static build. */
export function JeopardyPredictionSection({ isDark }: { isDark: boolean }) {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    fetchPredictions(controller.signal)
      .then((predictions) => {
        if (!cancelled) setLoad({ status: "ready", predictions });
      })
      .catch(() => {
        if (!cancelled) setLoad({ status: "error" });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [request]);

  function refresh() {
    setLoad({ status: "loading" });
    setRequest((current) => current + 1);
  }

  return (
    <SectionCard
      id="jeopardy-predictions"
      title="My Jeopardy! Predictions"
      subtitle="I built a machine learning model to predict whether the reigning Jeopardy! champion will win their next game."
      isDark={isDark}
    >
      <div className={styles.section} data-dark={isDark}>
        {load.status === "loading" ? (
          <div className={`${styles.message} portfolio-inset`} role="status">
            <span className={styles.loadingDot} aria-hidden="true" />
            Loading the latest prediction and track record…
          </div>
        ) : load.status === "error" ? (
          <div className={`${styles.message} portfolio-inset`} role="status">
            <p>Predictions are unavailable right now. Please try again.</p>
            <button type="button" className="portfolio-control rounded-full px-4 py-2" onClick={refresh}>
              Try again
            </button>
          </div>
        ) : (
          <PredictionContent predictions={load.predictions} />
        )}
      </div>
    </SectionCard>
  );
}

function PredictionContent({ predictions }: { predictions: JeopardyPrediction[] }) {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const latest = predictions[predictions.length - 1];
  const selected = predictions.find((prediction) => prediction.episode === selectedEpisode) ?? latest;
  const history = [...predictions].sort((a, b) => a.date.localeCompare(b.date) || a.episode - b.episode);
  const summary = summarizePredictions(predictions);

  return (
    <>
      <div className={styles.overview}>
        <article className={`${styles.prediction} portfolio-inset`}>
          <div className={styles.cardHeader}>
            <p className="portfolio-panel-label site-text-static">Latest prediction</p>
            <OutcomeBadge outcome={latest.outcome} />
          </div>
          <p className={styles.date}>{formatPredictionDate(latest.date)}</p>
          <p className={styles.championLabel}>Returning champion</p>
          <h3 className={styles.name}>{latest.name}</h3>
          {latest.hometown ? <p className={styles.hometown}>{latest.hometown}</p> : null}
          <p className={styles.call}>
            <span className="site-text-static" aria-hidden="true">{latest.predictedWin ? "↗" : "↘"}</span>
            {latest.predictedWin ? "Predicted to win" : "Predicted to lose"}
          </p>
          <div className={styles.probabilityLabel}>
            <span className="site-text-static">Chance of winning their next game</span>
            <strong>{latest.winProbability.toFixed(1)}%</strong>
          </div>
          <div className={styles.probabilityTrack} aria-hidden="true">
            <div style={{ width: `${latest.winProbability}%` }} />
          </div>
          <div className={styles.probabilityScale} aria-hidden="true">
            <span className="site-text-static">0%</span>
            <span className="site-text-static">100%</span>
          </div>
        </article>

        <article className={`${styles.record} portfolio-inset`}>
          <p className="portfolio-panel-label site-text-static">The track record</p>
          <div className={styles.metrics}>
            <MetricDonut
              label="Accuracy"
              metric={summary.accuracy}
              description="How often any prediction was right"
              completeColor="var(--jeopardy-correct)"
              remainingColor="var(--jeopardy-incorrect)"
            />
            <MetricDonut
              label="Precision"
              metric={summary.precision}
              description="How often a predicted win was right"
              completeColor="var(--jeopardy-correct)"
              remainingColor="var(--jeopardy-incorrect)"
            />
            <MetricDonut
              label="Recall"
              metric={summary.recall}
              description="How many actual wins the model caught"
              completeColor="var(--jeopardy-correct)"
              remainingColor="var(--jeopardy-incorrect)"
            />
          </div>
        </article>
      </div>

      <div className={`${styles.history} portfolio-inset`}>
        <div className={styles.cardHeader}>
          <h3 className={styles.historyTitle}>Prediction history</h3>
          <span className={`${styles.historyCount} site-text-static`}>{history.length} predictions</span>
        </div>
        <p className={styles.historyHelp}>Oldest to newest, left to right. Select a tile to explore a game.</p>
        <div className={styles.legend} aria-label="Prediction outcomes">
          {(["correct", "incorrect", "pending"] as const).map((outcome) => (
            <span key={outcome} className="site-text-static">
              <span className={`${styles.legendSymbol} ${styles[outcome]} site-text-static`} aria-hidden="true">{outcomeSymbols[outcome]}</span>
              {outcomeLabels[outcome]}
            </span>
          ))}
        </div>
        <div className={styles.tiles} role="group" aria-label="Prediction history">
          {history.map((prediction) => (
            <button
              key={prediction.episode}
              type="button"
              className={`${styles.tile} ${styles[prediction.outcome]}`}
              aria-pressed={selected.episode === prediction.episode}
              aria-controls="jeopardy-game-detail"
              aria-label={`${formatPredictionDate(prediction.date)}: ${prediction.name}, predicted ${prediction.predictedWin ? "win" : "loss"}, ${outcomeLabels[prediction.outcome].toLowerCase()}`}
              onClick={() => setSelectedEpisode(prediction.episode)}
            >
              <span aria-hidden="true" className="site-text-static">{outcomeSymbols[prediction.outcome]}</span>
            </button>
          ))}
        </div>
        <div className={styles.historyDates}>
          <span className="site-text-static">{formatPredictionDate(history[0].date)}</span>
          <span className="site-text-static">{formatPredictionDate(history[history.length - 1].date)}</span>
        </div>

        <div id="jeopardy-game-detail" className={styles.gameDetail} aria-live="polite" aria-atomic="true">
          <div>
            <p className={styles.detailDate}>{formatPredictionDate(selected.date)}</p>
            <p className={styles.detailName}>{selected.name}</p>
          </div>
          <dl className={styles.gameFacts}>
            <div>
              <dt>Prediction</dt>
              <dd>{selected.predictedWin ? "Win" : "Loss"}</dd>
            </div>
            <div>
              <dt>Win probability</dt>
              <dd>{selected.winProbability.toFixed(1)}%</dd>
            </div>
            <div>
              <dt>Actual result</dt>
              <dd>{selected.actualWin === null ? "Pending" : selected.actualWin ? "Win" : "Loss"}</dd>
            </div>
          </dl>
          <OutcomeBadge outcome={selected.outcome} />
        </div>
      </div>
    </>
  );
}

function MetricDonut({
  label,
  metric,
  description,
  completeColor,
  remainingColor
}: {
  label: string;
  metric: number | null;
  description: string;
  completeColor: string;
  remainingColor: string;
}) {
  const value = formatMetric(metric);
  const background = metric === null
    ? "var(--border)"
    : `conic-gradient(${completeColor} ${metric}%, ${remainingColor} 0)`;

  return (
    <div className={styles.metric}>
      <div className={styles.ring} style={{ background }} aria-hidden="true">
        <div><strong>{value}</strong></div>
      </div>
      <dl>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </dl>
      <p>{description}</p>
    </div>
  );
}

function formatMetric(metric: number | null) {
  return metric === null ? "—" : `${metric.toFixed(1)}%`;
}

function OutcomeBadge({ outcome }: { outcome: PredictionOutcome }) {
  return (
    <span className={`${styles.badge} ${styles[outcome]} site-text-static`}>
      <span aria-hidden="true" className="site-text-static">{outcomeSymbols[outcome]}</span>
      {outcomeLabels[outcome]}
    </span>
  );
}
