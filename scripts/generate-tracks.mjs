import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from 'music-metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const processTrack = async (entry, index) => {
  const fileName = entry.name;
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');

  const [rawArtist, ...rest] = withoutExt.split('-');
  const artist = rawArtist?.trim() || 'Unknown Artist';
  const title = rest.join('-').trim() || withoutExt.trim();

  let durationSeconds = null;

  try {
    const metadata = await parseFile(path.join(publicDir, fileName));
    durationSeconds = metadata.format.duration ?? null;
  } catch (err) {
    console.warn(`Не удалось прочитать длительность для ${fileName}:`, err.message);
  }

  return {
    id: index + 1,
    title,
    artist,
    src: `/audio-player-mc/${fileName}`,
    durationSeconds,
  };
};

const generateTracks = async () => {
  try {
    const entries = await fs.readdir(publicDir, { withFileTypes: true });

    const audioFiles = entries.filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.mp3'),
    );

    const tracks = await Promise.all(audioFiles.map(processTrack));

    const outPath = path.join(publicDir, 'tracks.json');

    await fs.writeFile(outPath, JSON.stringify({ tracks }, null, 2), 'utf8');

    console.log(`Generated ${tracks.length} tracks to ${outPath}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateTracks();
