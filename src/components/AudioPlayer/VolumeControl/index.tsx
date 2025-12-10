import { Volume2, VolumeX } from "lucide-react";
import { Button } from "components/ui/button.tsx";
import { Slider } from "components/ui/slider.tsx";
import {
  DEFAULT_SLIDER_STEP,
  MAX_PERCENT_VALUE,
} from "shared/constants/globals.ts";

type VolumeControlProps = {
  volume: number;
  isMuted: boolean;
  toggleMuteCallback: () => void;
  onChangeVolumeCallback: (volume: number[]) => void;
};

const VolumeControl = ({
  volume,
  isMuted,
  toggleMuteCallback,
  onChangeVolumeCallback,
}: VolumeControlProps) => {
  const volumeProgress = (isMuted ? 0 : (volume * MAX_PERCENT_VALUE));

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        onClick={toggleMuteCallback}
      >
        {isMuted ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </Button>

      <Slider
        className="cursor-pointer w-22"
        value={[volumeProgress]}
        max={MAX_PERCENT_VALUE}
        step={DEFAULT_SLIDER_STEP}
        onValueChange={onChangeVolumeCallback}
      />
    </div>
  );
};

export default VolumeControl;
