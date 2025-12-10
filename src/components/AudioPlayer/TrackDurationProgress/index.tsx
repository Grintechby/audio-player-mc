import { Slider } from "components/ui/slider.tsx";
import {
  DEFAULT_SLIDER_STEP,
  MAX_PERCENT_VALUE,
} from "shared/constants/globals.ts";
import { getTrackDurationProgress } from "components/AudioPlayer/TrackDurationProgress/config.ts";
import { formatSecondsToDurationTime } from "shared/helpers/formatters.ts";
import type { Track } from "types/types.ts";

type TrackDurationProgressProps = {
  currentTime: number;
  currentTrack: Track;
  handleProgressChangeCallback: (value: number[]) => void;
};

const TrackDurationProgress = ({
  currentTrack,
  currentTime,
  handleProgressChangeCallback,
}: TrackDurationProgressProps) => {
  const trackDurationProgressPercent = getTrackDurationProgress(
    currentTime,
    currentTrack.durationSeconds!,
  );

  const formattedCurrentTime = formatSecondsToDurationTime(currentTime);
  const formattedTrackDuration = formatSecondsToDurationTime(
    currentTrack.durationSeconds!,
  );

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-muted-foreground min-w-9">{formattedCurrentTime}</span>

      <Slider
        className="cursor-pointer"
        value={[trackDurationProgressPercent]}
        max={MAX_PERCENT_VALUE}
        step={DEFAULT_SLIDER_STEP}
        onValueChange={handleProgressChangeCallback}
      />

      <span className="text-muted-foreground min-w-9 text-right">
        {formattedTrackDuration}
      </span>
    </div>
  );
};

export default TrackDurationProgress;
