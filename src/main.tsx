import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientAtomProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientAtomProvider>
  </StrictMode>,
);
