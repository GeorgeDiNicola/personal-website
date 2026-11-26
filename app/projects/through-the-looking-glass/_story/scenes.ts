import type { Scene, SceneId } from './types';

/** Each playable step has a distinct illustration of its own moment in the book. */
export const scenes: Record<SceneId, Scene> = {
  mirror: {
    title: 'Through the looking-glass',
    landmark: 'The drawing-room mirror',
    square: 'd2',
    alt: 'Blonde Alice in a moss-green dress climbs through a misty mirror above a Victorian fireplace.',
  },
  garden: {
    title: 'The garden of live flowers',
    landmark: 'Crimson garden arch',
    square: 'd2',
    alt: 'Blonde Alice, seen from behind in a green dress, meets the crimson Red Queen among flowering hedges.',
  },
  'red-queen-run': {
    title: 'Running with the Red Queen',
    landmark: 'The chessboard fields',
    square: 'h5',
    alt: 'Blonde Alice and the Red Queen run hand in hand beneath a broad tree, their green and crimson dresses streaming behind them.',
  },
  railway: {
    title: 'A railway through the squares',
    landmark: 'The train’s leap',
    square: 'd4',
    alt: 'Blonde Alice watches from a crimson train as its wheels rise into the air to leap across a brook, with no bridge beneath it.',
  },
  shawl: {
    title: 'A shawl on the wind',
    landmark: 'The wandering shawl',
    square: 'c4',
    alt: 'Blonde Alice catches an ivory shawl as the disheveled White Queen reaches for it in a windy wood.',
  },
  'white-queen-memory': {
    title: 'A memory that works both ways',
    landmark: 'The White Queen’s conversation',
    square: 'c4',
    alt: 'Blonde Alice straightens the shawl around the White Queen’s shoulders as they talk in a quiet woodland clearing.',
  },
  sheep: {
    title: 'The Sheep’s shop',
    landmark: 'The knitting shopkeeper',
    square: 'c5',
    alt: 'Blonde Alice stands in a dark shop while a woolly Sheep in spectacles knits behind a counter surrounded by shelves.',
  },
  river: {
    title: 'Wool and water',
    landmark: 'The rowing boat',
    square: 'd5',
    alt: 'Blonde Alice reaches for scented rushes from a wooden rowing boat while the Sheep sits opposite her, knitting.',
  },
  'egg-shelf': {
    title: 'The egg on the shelf',
    landmark: 'The distant egg',
    square: 'f8',
    alt: 'Blonde Alice approaches an ordinary white egg on a distant shelf as the Sheep’s shop begins to turn into trees.',
  },
  humpty: {
    title: 'An egg upon a wall',
    landmark: 'Humpty’s stone wall',
    square: 'd6',
    alt: 'Blonde Alice looks up at Humpty Dumpty, a large egg-shaped gentleman sitting cross-legged on a narrow mossy stone wall, with a red belt around his waist.',
  },
  'queen-flight': {
    title: 'The White Queen runs past',
    mirrorIllustration: true,
    landmark: 'The King’s memorandum',
    square: 'c8',
    alt: 'Blonde Alice points at the White Queen running out of the woods while the seated White King writes in his notebook; the Lion and Unicorn rest nearby.',
  },
  woodland: {
    title: 'The seventh square',
    landmark: 'The empty plum cake dish',
    square: 'd7',
    alt: 'Blonde Alice kneels alone in a birch wood with her hands over her ears and an empty plum cake dish beside her.',
  },
  'knight-check': {
    title: 'The Red Knight’s claim',
    landmark: 'The crimson rider',
    square: 'e7',
    alt: 'The Red Knight sits upright in the saddle and points at Alice, his face covered by the lowered visor of a crimson helmet.',
  },
  forest: {
    title: 'The White Knight’s rescue',
    landmark: 'The rules of battle',
    square: 'e7',
    alt: 'The White Knight, smiling beneath a round ivory helmet with a brass rim, holds out his hand to Alice. She watches from behind a birch as the Red Knight rides away.',
  },
  'knight-return': {
    title: 'A handkerchief at the bend',
    landmark: 'The White Knight’s farewell',
    square: 'f5',
    alt: 'Alice waves a white handkerchief beside the brook. The White Knight waves back as he rides away with his ivory helmet tied to the saddle.',
  },
  arrival: {
    title: 'The eighth square',
    landmark: 'The last brook',
    square: 'd8',
    alt: 'Blonde Alice, still uncrowned, leaps across a narrow brook onto a soft green lawn dotted with flowers.',
  },
  palace: {
    mirrorIllustration: true,
    title: 'An examination on the lawn',
    landmark: 'The Queens’ questions',
    square: 'e8',
    alt: 'Crowned blonde Alice sits outdoors on the grass between the Red and White Queens as they question her and hold leafy fans.',
  },
  promotion: {
    title: 'A golden crown',
    landmark: 'The crown in Alice’s lap',
    square: 'd8',
    alt: 'Blonde Alice sits alone on a mossy lawn, examining the heavy golden crown she has lifted into her lap.',
  },
  'feast-arrival': {
    title: 'A place at her own table',
    landmark: 'Alice’s empty chair',
    square: 'd8',
    alt: 'Crowned blonde Alice arrives at her empty chair between the seated Red and White Queens, while animal and flower guests welcome her to an orderly banquet.',
  },
  feast: {
    mirrorIllustration: true,
    title: 'The White Queen in the soup',
    landmark: 'The soup-tureen',
    square: 'a6',
    alt: 'Crowned blonde Alice turns toward the White Queen’s face peeping from a soup-tureen as candles stretch and bottles sprout wings at the feast.',
  },
  capture: {
    title: 'The final capture',
    landmark: 'The little Red Queen',
    square: 'e8',
    alt: 'Crowned Alice holds a tiny carved Red Queen above a fallen green bottle. Her red shoes hang together and a crimson shawl trails from her shoulders. The floral tablecloth hangs over the table’s edge.',
  },
};
