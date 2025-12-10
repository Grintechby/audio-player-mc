import AudioPlayerControls from "components/AudioPlayer/PlayerControls";
import PlaylistTable from "components/AudioPlayer/PlaylistTable";
import TrackDurationProgress from "components/AudioPlayer/TrackDurationProgress";
import VolumeControl from "components/AudioPlayer/VolumeControl";
import { useAudioPlayer } from "shared/hooks/useAudioPlayer.ts";

const AudiPlayer = () => {
  const {
    handleChangeTrack,
    handleChangeVolume,
    currentTrack,
    handleSelectTrack,
    handleTrackProgressChange,
    currentTime,
    tracks,
    currentTrackId,
    volume,
    isMuted,
    toggleMute,
    togglePlay,
    isPlaying,
  } = useAudioPlayer();

  return (
    <div className="min-h-screen bg-gray-100 text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-xl border bg-card shadow-sm px-4 py-3 space-y-4">
        <div className="text-xs space-y-1">
          <p className="uppercase tracking-wide text-muted-foreground">
            Сейчас играет
          </p>
          <p className="text-sm font-medium">{currentTrack?.title || "-"}</p>
          <p className="text-muted-foreground">{currentTrack.artist || "-"}</p>
        </div>

        <TrackDurationProgress
          currentTime={currentTime}
          currentTrack={currentTrack}
          handleProgressChangeCallback={handleTrackProgressChange}
        />

        <AudioPlayerControls
          isPlaying={isPlaying}
          togglePlayCallback={togglePlay}
          handleChangeTrackCallback={handleChangeTrack}
        />

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          toggleMuteCallback={toggleMute}
          onChangeVolumeCallback={handleChangeVolume}
        />

        <PlaylistTable
          tracks={tracks}
          currentTrackId={currentTrackId!}
          onSelectTrackCallback={handleSelectTrack}
        />
      </div>
    </div>
  );
};

export default AudiPlayer;
