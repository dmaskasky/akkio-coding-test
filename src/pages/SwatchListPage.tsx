import { useAtomValue } from "jotai";
import { colorSwatchesQueryAtom } from "../atoms/colorSwatches";
import { SaturationLightnessControls } from "../components/SaturationLightnessControls";
import { ColorSwatchGrid } from "../components/ColorSwatchGrid";

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
      <hr className="controls-hr" />
    </header>
  );
}

function SwatchListGrid() {
  const query = useAtomValue(colorSwatchesQueryAtom);
  return (
    <main
      id="main-content"
      className="main"
      aria-label="Color swatches"
      aria-busy={query.isPending}
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

          .controls-hr {
            margin: 1.25rem 0 0 0;
            border: 0;
            border-top: 1px solid #ddd;
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
