import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table.tsx";
import { PLAYLIST_TABLE_CELLS } from "components/AudioPlayer/PlaylistTable/config.ts";
import { formatSecondsToDurationTime } from "shared/helpers/formatters.ts";
import type { Track } from "types/types.ts";

type PlaylistTableProps = {
  tracks: Track[];
  currentTrackId: number;
  onSelectTrackCallback: (id: number) => void;
};

const PlaylistTable = ({
  tracks,
  currentTrackId,
  onSelectTrackCallback,
}: PlaylistTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {PLAYLIST_TABLE_CELLS.map(({ name, className }) => (
            <TableHead key={name} className={className}>
              {name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {tracks.map((track) => (
          <TableRow
            key={track.id}
            className="cursor-pointer hover:bg-muted/60"
            onClick={() => onSelectTrackCallback(track.id)}
            data-state={track.id === currentTrackId ? "selected" : ""}
          >
            <TableCell className="text-center text-xs text-muted-foreground">
              {track.id}
            </TableCell>

            <TableCell className="font-medium">
              <div className="flex flex-col min-w-0 max-w-12">
                <span>{track.title}</span>
                <span className="md:hidden text-xs text-muted-foreground font-normal">
                  {track.artist}
                </span>
              </div>
            </TableCell>

            <TableCell className="hidden md:table-cell text-muted-foreground">
              {track.artist}
            </TableCell>

            <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
              {formatSecondsToDurationTime(track.durationSeconds!)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlaylistTable;
