import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "components/ui/button.tsx";

type AudioPlayerControlsProps = {
  isPlaying: boolean;
  togglePlayCallback: () => void;
  handleChangeTrackCallback: (isNextTrack?: boolean) => void;
};

const AudioPlayerControls = ({
  handleChangeTrackCallback,
  togglePlayCallback,
  isPlaying,
}: AudioPlayerControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        className="rounded-full cursor-pointer"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleChangeTrackCallback(false)}
      >
        <SkipBack className="size-4" />
      </Button>

      <Button
        className="rounded-full bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
        variant="default"
        size="icon-lg"
        onClick={togglePlayCallback}
      >
        {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
      </Button>

      <Button
        className="rounded-full cursor-pointer"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleChangeTrackCallback()}
      >
        <SkipForward className="size-4" />
      </Button>
    </div>
  );
};

export default AudioPlayerControls;
