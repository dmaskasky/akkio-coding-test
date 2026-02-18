import { useAtomValue } from "jotai";
import { ColorSwatch } from "./ColorSwatch";
import { colorSwatchesGridStateAtom } from "../atoms/colorSwatches";

export function ColorSwatchGrid() {
  const { swatches, hasSwatches, errorMessage, isPending } = useAtomValue(
    colorSwatchesGridStateAtom,
  );

  return (
    <div
      className="grid-wrapper"
      role="region"
      aria-label="Color swatch grid"
      aria-live="polite"
      aria-busy={isPending}
      aria-atomic="false"
    >
      {errorMessage && !hasSwatches ? (
        <p className="message error" role="alert" aria-live="assertive">
          {errorMessage}
        </p>
      ) : !hasSwatches && isPending ? (
        <p className="message" role="status" aria-live="polite">
          Loading color swatches…
        </p>
      ) : null}
      {hasSwatches ? (
        <>
          <ul className="flex" role="list">
            {swatches.map((swatch) => (
              <li key={swatch.name} className="flex-item">
                <ColorSwatch
                  swatch={swatch}
                  to="/id"
                  search={{
                    hex: swatch.hex.replace("#", ""),
                    format: "html",
                  }}
                />
              </li>
            ))}
          </ul>
          {isPending ? (
            <p
              className="message loading-inline"
              role="status"
              aria-live="polite"
            >
              Updating…
            </p>
          ) : errorMessage ? (
            <p
              className="message loading-inline error"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}
        </>
      ) : null}
      <style>{`
        @scope {
          .grid-wrapper {
            width: 100%;
            padding: 1rem 0;
          }

          .flex {
            display: flex;
            flex-wrap: wrap;
            gap: 1.75rem;
            width: 100%;
            justify-content: flex-start;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .flex-item {
            width: 140px;
            flex: 0 0 140px;
          }

          .flex-item .swatch {
            width: 100%;
          }

          .message {
            padding: 2rem;
            text-align: center;
            color: var(--text-muted, #666);
          }

          .message.error {
            color: var(--error, #c00);
          }

          .message.loading-inline {
            margin-top: 0.75rem;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
