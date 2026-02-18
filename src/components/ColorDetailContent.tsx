import {
  colorApiIdUrl,
  colorApiSchemeUrl,
  type ColorApiResponse,
} from "../api/colorApi";

type ColorDetailContentProps = {
  detail: ColorApiResponse;
};

function frac(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n * 100) / 100) : "-";
}

function FractionCell({
  entries,
}: {
  entries: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="fraction-cell">
      {entries.map(({ label, value }) => (
        <div key={label}>
          {label} : {value}
        </div>
      ))}
    </div>
  );
}

export function ColorDetailContent({ detail }: ColorDetailContentProps) {
  const { hex, rgb, hsl, name, contrast } = detail;
  const schemeUrl = colorApiSchemeUrl(hex.clean);
  const contrastColor = contrast?.value ?? "#fff";

  return (
    <div className="detail-content">
      <header className="header">
        <a
          href={schemeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="header-bar"
          style={{ backgroundColor: hex.value, color: contrastColor }}
        >
          <div className="header-bar-line1">
            <strong>"{name.value}" schemes at</strong>
          </div>
          <div className="header-bar-line2">/scheme?hex={hex.clean}</div>
        </a>
      </header>
      <div className="swatch-large-wrap">
        <div
          className="swatch-large"
          style={{ backgroundColor: hex.value, color: contrastColor }}
        >
          <span className="swatch-large-text" aria-hidden="true">
            {name.value}
          </span>
        </div>
      </div>
      <div className="tables">
        <section className="section">
          <h3 className="section-title">hex</h3>
          <table className="table">
            <thead>
              <tr>
                <th>value</th>
                <th>clean</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{hex.value}</td>
                <td>{hex.clean}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="section">
          <h3 className="section-title">rgb</h3>
          <table className="table">
            <thead>
              <tr>
                <th>fraction</th>
                <th>r</th>
                <th>g</th>
                <th>b</th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fraction-td">
                  <FractionCell
                    entries={[
                      { label: "r", value: frac(rgb.fraction?.r) },
                      { label: "g", value: frac(rgb.fraction?.g) },
                      { label: "b", value: frac(rgb.fraction?.b) },
                    ]}
                  />
                </td>
                <td>{rgb.r}</td>
                <td>{rgb.g}</td>
                <td>{rgb.b}</td>
                <td>{rgb.value}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="section">
          <h3 className="section-title">hsl</h3>
          <table className="table">
            <thead>
              <tr>
                <th>fraction</th>
                <th>h</th>
                <th>s</th>
                <th>l</th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fraction-td">
                  <FractionCell
                    entries={[
                      { label: "h", value: frac(hsl.fraction?.h) },
                      { label: "s", value: frac(hsl.fraction?.s) },
                      { label: "l", value: frac(hsl.fraction?.l) },
                    ]}
                  />
                </td>
                <td>{hsl.h}</td>
                <td>{hsl.s}</td>
                <td>{hsl.l}</td>
                <td>{hsl.value}</td>
              </tr>
            </tbody>
          </table>
        </section>
        {detail.hsv ? (
          <section className="section">
            <h3 className="section-title">hsv</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>fraction</th>
                  <th>value</th>
                  <th>h</th>
                  <th>s</th>
                  <th>v</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fraction-td">
                    <FractionCell
                      entries={[
                        { label: "h", value: frac(detail.hsv.fraction?.h) },
                        { label: "s", value: frac(detail.hsv.fraction?.s) },
                        { label: "v", value: frac(detail.hsv.fraction?.v) },
                      ]}
                    />
                  </td>
                  <td>{detail.hsv.value}</td>
                  <td>{detail.hsv.h}</td>
                  <td>{detail.hsv.s}</td>
                  <td>{detail.hsv.v}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}
        <section className="section">
          <h3 className="section-title">name</h3>
          <table className="table">
            <thead>
              <tr>
                <th>value</th>
                <th>closest_named_hex</th>
                <th>exact_match_name</th>
                <th>distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{name.value}</td>
                <td>{name.closest_named_hex}</td>
                <td>{String(name.exact_match_name)}</td>
                <td>{name.distance}</td>
              </tr>
            </tbody>
          </table>
        </section>
        {detail.cmyk ? (
          <section className="section">
            <h3 className="section-title">cmyk</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>fraction</th>
                  <th>value</th>
                  <th>c</th>
                  <th>m</th>
                  <th>y</th>
                  <th>k</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fraction-td">
                    <FractionCell
                      entries={[
                        { label: "c", value: frac(detail.cmyk.fraction?.c) },
                        { label: "m", value: frac(detail.cmyk.fraction?.m) },
                        { label: "y", value: frac(detail.cmyk.fraction?.y) },
                        { label: "k", value: frac(detail.cmyk.fraction?.k) },
                      ]}
                    />
                  </td>
                  <td>{detail.cmyk.value}</td>
                  <td>{detail.cmyk.c}</td>
                  <td>{detail.cmyk.m}</td>
                  <td>{detail.cmyk.y}</td>
                  <td>{detail.cmyk.k}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}
        {detail.XYZ ? (
          <section className="section">
            <h3 className="section-title">xyz</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>fraction</th>
                  <th>value</th>
                  <th>X</th>
                  <th>Y</th>
                  <th>Z</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fraction-td">
                    <FractionCell
                      entries={[
                        { label: "X", value: frac(detail.XYZ.fraction?.X) },
                        { label: "Y", value: frac(detail.XYZ.fraction?.Y) },
                        { label: "Z", value: frac(detail.XYZ.fraction?.Z) },
                      ]}
                    />
                  </td>
                  <td>{detail.XYZ.value}</td>
                  <td>{detail.XYZ.X}</td>
                  <td>{detail.XYZ.Y}</td>
                  <td>{detail.XYZ.Z}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}
        {detail.image ? (
          <section className="section">
            <h3 className="section-title">image</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>bare</th>
                  <th>named</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{colorApiIdUrl(hex.clean, "svg")}&amp;named=false</td>
                  <td>{colorApiIdUrl(hex.clean, "svg")}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}
        {contrast ? (
          <section className="section">
            <h3 className="section-title">contrast</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{contrast.value}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}
      </div>
      <style>{`
        @scope {
          .detail-content {
            font-family: "Futura", "Century Gothic", Helvetica, sans-serif;
            font-size: 15px;
            line-height: 1.4em;
            background: #fff;
            text-align: center;
          }

          .header {
            margin-bottom: 1.25rem;
            display: flex;
            justify-content: center;
          }

          .header-bar {
            display: inline-block;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            text-decoration: none;
            font-size: 15px;
            line-height: 1.4em;
            cursor: pointer;
            border: 2px solid #000;
          }

          .header-bar:hover {
            opacity: 0.95;
          }

          .header-bar-line1 {
            font-weight: 700;
            text-decoration: underline;
          }

          .header-bar-line2 {
            text-decoration: underline;
          }

          .swatch-large-wrap {
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: center;
          }

          .swatch-large {
            width: 100px;
            height: 100px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .swatch-large-text {
            font-size: 15px;
            line-height: 1.4em;
            font-weight: 600;
            text-align: center;
          }

          .tables {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
            text-align: left;
          }

          .section {
            width: 520px;
          }

          .section-title {
            font-size: 12.5px;
            font-weight: normal;
            font-style: italic;
            line-height: 1.4em;
            margin: 0 0 0.4rem 0;
            color: #1a1a1a;
            text-transform: lowercase;
            text-align: center;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 15px;
            line-height: 1.4em;
            border: 1px solid #bbb;
          }

          .table thead th {
            text-align: center;
            padding: 0.4rem 0.6rem;
            border: 1px solid #bbb;
            font-weight: 700;
            background: #ddd;
          }

          .table tbody td {
            text-align: center;
            padding: 0.4rem 0.6rem;
            border: 1px solid #bbb;
            vertical-align: top;
            background: #fff;
            font-weight: normal;
          }

          .table tbody td.fraction-td {
            text-align: center;
          }

          .fraction-cell {
            text-align: center;
          }

          .fraction-cell > div {
            display: block;
            line-height: 1.5em;
          }

          .table a {
            word-break: break-all;
            color: #0066cc;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
}
