import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { SwatchListPage } from "./pages/SwatchListPage";
import { ColorDetailPage } from "./pages/ColorDetailPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SwatchListPage,
});

const idRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/id",
  validateSearch: (search: Record<string, unknown>) => {
    const hex = typeof search.hex === "string" ? search.hex : "";
    const format = typeof search.format === "string" ? search.format : "html";
    return { hex, format };
  },
  component: ColorDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, idRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
