import { type ReactNode } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ColorDetailContent } from "../components/ColorDetailContent";
import { colorDetailQueryAtomFamily } from "../atoms/colorDetail";

function DetailPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <header className="page-top-bar" aria-label="Page header">
        <Link to="/" className="back">
          ← Back to Color Swatches
        </Link>
      </header>
      <div className="page-center">{children}</div>
      <style>{pageStyles}</style>
    </div>
  );
}

export function ColorDetailPage() {
  const { hex: hexParam } = useSearch({ from: "/id" });
  const hex = hexParam ?? "";
  const query = useAtomValue(colorDetailQueryAtomFamily(hex));

  const { data: detail, isPending: loading, error } = query;
  const errorMessage =
    error instanceof Error ? error.message : error ? "Failed to load" : null;

  if (hex.length === 0) {
    return (
      <DetailPageLayout>
        <p className="message error">Missing color</p>
      </DetailPageLayout>
    );
  }

  if (loading) {
    return (
      <DetailPageLayout>
        <p className="message">Loading…</p>
      </DetailPageLayout>
    );
  }

  if (errorMessage || !detail) {
    return (
      <DetailPageLayout>
        <p className="message error">{errorMessage ?? "Color not found"}</p>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout>
      <ColorDetailContent detail={detail} />
    </DetailPageLayout>
  );
}

const pageStyles = `
  @scope {
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .page-top-bar {
      width: 100%;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
    }

    .page-top-bar .back {
      color: #0066cc;
      text-decoration: underline;
      cursor: pointer;
    }

    .page-top-bar .back:hover {
      color: #004499;
    }

    .page-center {
      flex: 1;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2rem;
      box-sizing: border-box;
    }

    .message {
      padding: 2rem;
      color: #666;
      text-align: center;
    }

    .message.error {
      color: #c00;
    }
  }
`;
