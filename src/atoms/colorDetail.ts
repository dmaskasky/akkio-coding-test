import { atomFamily } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { colorDetailQueryOptions } from "../queries/colorDetail";

export const colorDetailQueryAtomFamily = atomFamily((hex: string) =>
  atomWithQuery(() => colorDetailQueryOptions(hex)),
);
