import { queryOptions } from "@tanstack/react-query";
import { fetchColorByHex } from "../api/colorApi";
import type { ColorApiResponse } from "../api/colorApi";

export function colorDetailQueryOptions(hex: string) {
  return queryOptions({
    queryKey: ["colorDetail", hex] as const,
    queryFn: (): Promise<ColorApiResponse> => fetchColorByHex(hex),
    enabled: hex.length > 0,
  });
}
