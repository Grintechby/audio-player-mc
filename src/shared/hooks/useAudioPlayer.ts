import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTracks } from "api/tracks.ts";
import { DEFAULT_VOLUME, MAX_PERCENT_VALUE } from "shared/constants/globals.ts";
import type { Track } from "types/types.ts";

export const useAudioPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = useMemo(
    () => tracks.find((track) => (track.id === currentTrackId)) || ({} as Track),
    [tracks, currentTrackId],
  );

  const currentTrackFullPath = window.location.origin + currentTrack?.src;

  const isTrackChanged = audioRef.current?.src !== currentTrackFullPath;

  const loadTracks = useCallback(async () => {
    try {
      const { tracks: tracksData } = await getTracks();

      setTracks(tracksData);

      if (tracksData?.length) {
        setCurrentTrackId(tracksData[0].id);
      }
    } catch (error) {
      console.error("Error loading tracks", error);
    }
  }, []);

  const handleSelectTrack = useCallback(
    (id: number) => {
      if (id === currentTrackId) {
        return;
      }

      setCurrentTrackId(id);
      setIsPlaying(true);
    },
    [currentTrackId],
  );

  const handleChangeTrack = useCallback(
    (isNextTrack: boolean = true) => {
      if (!tracks?.length) {
        return;
      }

      const currentTrackIndex = tracks.findIndex(
        (track) => track.id === currentTrackId,
      );

      const nextTrackIndex =
        (currentTrackIndex === (tracks.length - 1) ? 0 : (currentTrackIndex + 1));

      const prevTrackIndex =
        (currentTrackIndex <= 0) ? (tracks.length - 1) : (currentTrackIndex - 1);

      const trackIndex = isNextTrack ? nextTrackIndex : prevTrackIndex;

      const chosenTrackId = tracks[trackIndex]!.id;

      handleSelectTrack(chosenTrackId);
    },
    [tracks, currentTrackId, handleSelectTrack],
  );

  const togglePlay = () => {
    setIsPlaying((prevState) => !prevState);
  };

  const handleTrackProgressChange = (value: number[]) => {
    if (!audioRef.current || !currentTrack?.durationSeconds) {
      return;
    }

    const [progressPercent] = value;

    const newTime = ((progressPercent / MAX_PERCENT_VALUE) * currentTrack.durationSeconds);

    audioRef.current.currentTime = newTime;

    setCurrentTime(newTime);
  };

  const handleChangeVolume = (value: number[]) => {
    const [volumePercent] = value;
    const volumeValue = (volumePercent / MAX_PERCENT_VALUE);

    setVolume(volumeValue);

    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volumeValue;
    }
  };

  const toggleMute = () => {
    setIsMuted((prevState) => {
      if (!audioRef.current) {
        return prevState;
      }

      audioRef.current.muted = !prevState;

      return !prevState;
    });
  };

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  useEffect(() => {
    if (!currentTrack?.src) {
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (isTrackChanged) {
      audioRef.current.src = currentTrack.src;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    };

    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentTrack, isTrackChanged]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const handleEnded = () => handleChangeTrack();

    audioRef.current?.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [handleChangeTrack]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current[isPlaying ? "play" : "pause"]();
  }, [isPlaying, currentTrack]);

  return {
    currentTrack,
    currentTime,
    volume,
    isMuted,
    isPlaying,
    tracks,
    currentTrackId,
    handleChangeTrack,
    handleSelectTrack,
    togglePlay,
    toggleMute,
    handleTrackProgressChange,
    handleChangeVolume,
  };
};
