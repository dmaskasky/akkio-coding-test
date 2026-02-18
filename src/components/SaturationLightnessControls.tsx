import { memo, type ChangeEvent } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  saturationAtom,
  lightnessAtom,
  debouncedSaturationAtom,
  debouncedLightnessAtom,
} from "../atoms/colorSwatches";

function SaturationLightnessControlsInner() {
  const saturation = useAtomValue(saturationAtom);
  const lightness = useAtomValue(lightnessAtom);
  const setSaturation = useSetAtom(debouncedSaturationAtom);
  const setLightness = useSetAtom(debouncedLightnessAtom);

  const handleS = (e: ChangeEvent<HTMLInputElement>) => {
    setSaturation(Number(e.target.value));
  };
  const handleL = (e: ChangeEvent<HTMLInputElement>) => {
    setLightness(Number(e.target.value));
  };

  return (
    <div
      className="controls"
      role="group"
      aria-label="Saturation and lightness"
    >
      <label className="control" htmlFor="saturation-slider">
        <span className="label">Saturation: {saturation}%</span>
        <input
          id="saturation-slider"
          type="range"
          min={0}
          max={100}
          value={saturation}
          onChange={handleS}
          className="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={saturation}
          aria-valuetext={`${saturation}% saturation`}
        />
      </label>
      <label className="control" htmlFor="lightness-slider">
        <span className="label">Lightness: {lightness}%</span>
        <input
          id="lightness-slider"
          type="range"
          min={0}
          max={100}
          value={lightness}
          onChange={handleL}
          className="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={lightness}
          aria-valuetext={`${lightness}% lightness`}
        />
      </label>
      <style>{`
        @scope {
          .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem 2rem;
            padding: 1rem 0;
          }

          .control {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            min-width: 180px;
          }

          .label {
            font-size: 15px;
            line-height: 1.4em;
          }

          .slider {
            width: 100%;
            height: 8px;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
}

export const SaturationLightnessControls = memo(
  SaturationLightnessControlsInner,
);
