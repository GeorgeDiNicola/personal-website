import { scenes } from './scenes';
import type { SceneId } from './types';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
const artDirectory = (basePath ? '/' + basePath : '') + '/projects/through-the-looking-glass/art';

/** Serve local illustrations at a resolution suited to their size and screen density. */
export function SceneArt({
  scene,
  sizes,
  priority = false,
}: {
  scene: SceneId;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <img
        src={`${artDirectory}/${scene}.webp`}
        srcSet={`${artDirectory}/${scene}-mobile.webp 768w, ${artDirectory}/${scene}.webp 1536w`}
        sizes={sizes}
        alt={scenes[scene].alt}
        style={scenes[scene].mirrorIllustration ? { transform: 'scaleX(-1)' } : undefined}
        width={1536}
        height={1024}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
