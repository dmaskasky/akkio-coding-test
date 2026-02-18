import { Link } from "@tanstack/react-router";
import type { ColorSwatchData } from "../api/colorApi";

type ColorSwatchProps = {
  swatch: ColorSwatchData;
  to?: string;
  search?: { hex: string; format?: string };
};

export function ColorSwatch({ swatch, to, search }: ColorSwatchProps) {
  const { name, hex } = swatch;

  const content = (
    <>
      <div className="patch" style={{ backgroundColor: hex }} />
      <div className="label-space">
        <span className="label">{name}</span>
      </div>
    </>
  );

  const sharedStyle = (
    <style>{`
      @scope {
        .swatch {
          display: block;
          position: relative;
          overflow: visible;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: pointer;
          text-decoration: none !important;
          color: inherit;
        }

        .swatch * {
          text-decoration: none !important;
        }

        .swatch:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .swatch:focus-visible {
          outline: 2px solid #646cff;
          outline-offset: 2px;
        }

        .patch {
          width: 100%;
          aspect-ratio: 1;
        }

        .label-space {
          position: relative;
          min-height: 1.4em;
          padding: 0.5rem 0 0;
          font-size: 14px;
          line-height: 1.4em;
          font-family: "Futura", "Century Gothic", Helvetica, sans-serif;
        }

        .label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0.5rem;
          white-space: nowrap;
          font-weight: 600;
          color: #607340;
          text-decoration: none;
          text-align: center;
        }
      }
    `}</style>
  );

  if (to && search) {
    return (
      <Link
        to={to}
        search={search}
        className="swatch"
        aria-label={`View details for ${name}`}
      >
        {content}
        {sharedStyle}
      </Link>
    );
  }

  return (
    <div className="swatch" style={{ cursor: "default" }}>
      {content}
      {sharedStyle}
    </div>
  );
}
