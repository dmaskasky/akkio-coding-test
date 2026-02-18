import { useAtomValue } from "jotai";
import { showSpinnerAtom } from "../atoms/colorSwatches";
import { SaturationLightnessControls } from "../components/SaturationLightnessControls";
import { ColorSwatchGrid } from "../components/ColorSwatchGrid";

function ControlsHrWithSpinner() {
  const showSpinner = useAtomValue(showSpinnerAtom);

  return (
    <div className="controls-hr-wrap">
      <hr className="controls-hr" />
      {showSpinner ? (
        <div
          className="loading-spinner"
          role="progressbar"
          aria-valuetext="Loading colors"
        />
      ) : null}
    </div>
  );
}

function SwatchListHeader() {
  return (
    <header className="header" aria-label="Page header">
      <h1 className="title">Color Swatches</h1>
      <p className="subtitle">
        Adjust saturation and lightness to see distinct named colors (from{" "}
        <a
          href="https://www.thecolorapi.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Color API (opens in new tab)"
        >
          The Color API
        </a>
        ).
      </p>
      <SaturationLightnessControls />
      <ControlsHrWithSpinner />
    </header>
  );
}

function SwatchListGrid() {
  const isBusy = useAtomValue(showSpinnerAtom);

  return (
    <main
      id="main-content"
      className="main"
      aria-label="Color swatches"
      aria-busy={isBusy}
    >
      <ColorSwatchGrid />
    </main>
  );
}

export function SwatchListPage() {
  return (
    <div>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="content">
        <SwatchListHeader />
        <SwatchListGrid />
      </div>
      <style>{`
        @scope {
          --accent: #646cff;
          --accent-hover: #535bf2;
          --text: #1a1a1a;
          --text-muted: #666;

          .skip-link {
            position: absolute;
            left: -9999px;
            top: 0.5rem;
            z-index: 999;
            padding: 0.5rem 1rem;
            background: var(--accent);
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }

          .skip-link:focus {
            left: 0.5rem;
          }

          .content {
            max-width: 100%;
            padding: 1rem;
            min-height: 100vh;
            box-sizing: border-box;
          }

          .header {
            margin-bottom: 1.5rem;
          }

          .title {
            font-size: 1.75rem;
            line-height: 1.4em;
            margin: 0 0 1.25rem 0;
            color: var(--text);
          }

          .subtitle {
            margin: 0 0 0.5rem 0;
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.4em;
          }

          .controls-hr-wrap {
            position: relative;
            margin: 1.25rem 0 0 0;
            overflow: visible;
          }

          .controls-hr {
            border: 0;
            border-top: 1px solid #ddd;
            margin: 0;
          }

          .loading-spinner {
            position: absolute;
            top: -2px;
            left: 0;
            right: 0;
            height: 4px;
            pointer-events: none;
            background: linear-gradient(
              90deg,
              transparent 0%,
              var(--accent) 20%,
              var(--accent) 80%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: loading-spinner-shift 1.8s ease-in-out infinite;
          }

          @keyframes loading-spinner-shift {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          .main {
            outline: none;
            padding-top: 1.25rem;
          }

          .subtitle a {
            color: var(--accent);
            cursor: pointer;
          }

          .subtitle a:hover {
            color: var(--accent-hover);
          }
        }
      `}</style>
    </div>
  );
}
