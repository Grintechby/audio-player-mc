import { MAX_PERCENT_VALUE } from 'shared/constants/globals';

export const getTrackDurationProgress = (currentTime: number, durationSeconds: number) => {
  if (!durationSeconds) {
    return 0;
  }

  return ((currentTime / durationSeconds) * MAX_PERCENT_VALUE);
};
