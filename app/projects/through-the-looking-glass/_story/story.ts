import transcription from './carroll-chess.json' with { type: 'json' };
import type { BoardSnapshot, Motion, Piece, StoryEvent } from './types';

export const sourceRoot =
  'https://en.wikisource.org/wiki/Through_the_Looking-Glass,_and_What_Alice_Found_There';
const chapter = (roman: string, locator: string): StoryEvent['source'] => ({
  url: `${sourceRoot}/Chapter_${roman}`,
  locator: `Chapter ${roman} · ${locator}`,
});
export const initialBoard: BoardSnapshot = [
  { id: 'white-king', name: 'White King', color: 'White', type: 'king', square: 'c6' },
  { id: 'white-queen', name: 'White Queen', color: 'White', type: 'queen', square: 'c1' },
  { id: 'white-knight', name: 'White Knight', color: 'White', type: 'knight', square: 'f5' },
  { id: 'white-rook', name: 'White Rook', color: 'White', type: 'rook', square: 'f1' },
  { id: 'alice', name: 'Alice', color: 'White', type: 'pawn', square: 'd2' },
  { id: 'red-king', name: 'Red King', color: 'Red', type: 'king', square: 'e4' },
  { id: 'red-queen', name: 'Red Queen', color: 'Red', type: 'queen', square: 'e2' },
  { id: 'red-knight', name: 'Red Knight', color: 'Red', type: 'knight', square: 'g8' },
];

type AuthoredEvent = Omit<StoryEvent, 'before' | 'board'>;
const entries: AuthoredEvent[] = [
  {
    id: 'mirror',
    turn: 0,
    kind: 'initial',
    title: 'Step through the looking-glass.',
    momentTitle: 'Alice steps through the looking-glass',
    label: 'Through the looking-glass',
    scene: 'mirror',
    excerpt: 'White Pawn (Alice) to play, and win in eleven moves.',
    source: { url: sourceRoot, locator: 'Front matter · chess diagram' },
    chess:
      'Eight pieces, a world of possibilities. You are looking from White’s side: a1 is at the bottom left. Alice is the white pawn on d2. Touch any piece to meet its character.',
    story:
      'Alice wonders what lies beyond the drawing-room mirror. She climbs onto the mantelpiece and passes through the glass as it melts into mist. On the other side, the chess pieces are alive. She finds a book printed backwards and holds it up to the mirror to read a strange poem called “Jabberwocky.”',
    rule: {
      title: 'How the steps are counted',
      text: 'After the mirror, 19 steps cover the 21 entries in Carroll’s chess list. The printed list numbers its rows 1 to 11. Alice’s meetings with the Queens and the two palace entrances leave the pieces in place.',
    },
  },
  {
    id: 'red-queen-meeting',
    turn: 1,
    kind: 'encounter',
    title: 'A country made of squares',
    momentTitle: 'Alice meets the Red Queen',
    label: 'Story event · no piece moves',
    scene: 'garden',
    excerpt: 'all the ways about here belong to me',
    source: chapter('II', 'the Red Queen’s directions'),
    chess:
      'Alice stays on d2, the White Queen’s pawn’s starting square. The Red Queen remains on e2. This meeting introduces the game without changing its diagram: a conversation is enough to occupy Carroll’s first entry.',
    story:
      'From the hill, hedges and brooks reveal a giant chessboard. The Red Queen offers Alice the place of Lily, a pawn too young to play. The promise is simple: reach the eighth square and become a queen.',
    rule: {
      title: 'An encounter is an event',
      text: 'Meeting the Red Queen does not mean moving Alice beside her. The board represents the printed chess scheme, rather than a literal map of every step the characters take.',
    },
  },
  {
    id: 'red-queen-departs',
    turn: 1,
    kind: 'move',
    title: 'The Queen sets the course',
    momentTitle: 'Alice runs with the Red Queen',
    label: 'Red Queen · e2 → h5',
    scene: 'red-queen-run',
    motion: { piece: 'red-queen', from: 'e2', to: 'h5' },
    excerpt: 'it takes all the running you can do, to keep in the same place.',
    source: chapter('II', 'running with the Red Queen'),
    chess:
      'The Red Queen travels diagonally from e2 through f3 and g4 to h5. The line is clear. From Red’s end of the board, the king-rook’s fourth square is h5, not h4.',
    story:
      'The Red Queen takes Alice’s hand and runs with her as fast as they can, but Alice is astonished to find they are still beneath the same tree. Afterwards, she marks out Alice’s route with pegs and explains that Alice will become a queen when she reaches the eighth square. The Queen vanishes, leaving Alice to wonder where she has gone.',
    rule: {
      title: 'A sound trajectory, an unusual game',
      text: 'This is a normal queen movement. The strangeness lies in the authored sequence as a whole; surprising story logic does not make every individual movement illegal.',
    },
  },
  {
    id: 'railway',
    turn: 2,
    kind: 'move',
    title: 'A ticket to the fourth square',
    momentTitle: 'Alice rides the train',
    label: 'Alice · d2 → d4, through d3',
    scene: 'railway',
    motion: { piece: 'alice', from: 'd2', via: 'd3', to: 'd4' },
    excerpt: 'Tweedledum and Tweedledee',
    source: chapter('IV', 'the twins’ names'),
    chess:
      'Alice’s first displacement is the pawn’s two-square opening advance. She passes through d3 by railway and arrives at d4. Both squares are empty, so the pawn’s path is conventional.',
    story:
      'Alice finds herself on a crowded train without a ticket. As the Guard and other passengers question her, she hears the Gnat’s voice whispering in her ear. The passengers’ strange remarks leave her more confused than ever. Then the train leaps over a brook and vanishes.',
  },
  {
    id: 'shawl',
    turn: 2,
    kind: 'move',
    title: 'Alice meets the White Queen',
    momentTitle: 'Alice meets the White Queen',
    label: 'White Queen · c1 → c4',
    scene: 'shawl',
    motion: { piece: 'white-queen', from: 'c1', to: 'c4' },
    excerpt: 'She caught the shawl as she spoke',
    source: chapter('V', 'opening sentence'),
    chess:
      'The White Queen rises three ranks along the c-file, through c2 and c3 to c4. Alice is on d4, one file to her right. Carroll lists their meeting separately at the start of turn 3, while both pieces stay in place.',
    story:
      'A shawl blows through the trees, and Alice catches it just before the White Queen comes running after it. After Alice helps her put it back on, the Queen offers her a job as a maid for two pence a week, with jam yesterday and tomorrow, but never today. Stranger still, the Queen says her memory works both ways, so she can remember things that haven’t happened yet.',
    rule: {
      title: 'White follows White',
      text: 'Alice and the White Queen have moved in consecutive entries. Carroll’s right-hand column is not a column of Red replies. Reading it as a normal alternating scoresheet would change the story.',
    },
  },
  {
    id: 'white-queen-meeting',
    turn: 3,
    kind: 'encounter',
    title: 'A memory that works both ways',
    momentTitle: 'The White Queen remembers the future',
    label: 'Story event · no piece moves',
    scene: 'white-queen-memory',
    excerpt: "It's a poor sort of memory that only works backwards",
    source: chapter('V', 'living backwards'),
    chess:
      'The meeting holds Alice on d4 and the White Queen on c4. This is a new entry despite an identical position. The two adjacent squares anchor a conversation, not a capture.',
    story:
      'Alice helps the White Queen put on her shawl and untangle her hair. The Queen offers to hire her as a maid, with jam yesterday and jam tomorrow, but never today. She can even remember things before they happen.',
  },
  {
    id: 'sheep',
    turn: 3,
    kind: 'move',
    title: 'The Queen becomes a Sheep',
    label: 'White Queen · c4 → c5',
    scene: 'sheep',
    motion: { piece: 'white-queen', from: 'c4', to: 'c5' },
    excerpt: 'Are you a child or a teetotum?',
    source: chapter('V', 'the Sheep’s shop'),
    chess:
      'The White Queen moves one square up the c-file. On the board she remains the same White Queen, now at c5. Her story appearance changes into a shopkeeping Sheep; her chess identity does not.',
    story:
      'The White Queen’s shawl blows across a brook and Alice follows her after it. The Queen’s voice begins to sound like a sheep, and suddenly Alice finds herself in a dark little shop, with a Sheep knitting behind the counter.',
    rule: {
      title: 'Transformation is not promotion',
      text: 'Becoming the Sheep changes the Queen’s narrative role, not her chess type or color. No extra piece appears on c5.',
    },
  },
  {
    id: 'river',
    turn: 4,
    kind: 'move',
    title: 'The shop becomes a river',
    momentTitle: 'Alice rows with the Sheep',
    label: 'Alice · d4 → d5',
    scene: 'river',
    motion: { piece: 'alice', from: 'd4', to: 'd5' },
    excerpt: 'Can you row?',
    source: chapter('V', 'knitting needles become oars'),
    chess:
      'Alice advances one square from d4 to d5. She is now beside the White Queen at c5. The pawn stays on the d-file throughout the changing scenery.',
    story:
      'The Sheep gives Alice a pair of knitting needles. When they turn into oars, both travelers are suddenly in a boat. While the Sheep knits, Alice rows and picks fragrant river flowers, but those she gathers begin to fade. The boat, oars, and river vanish, leaving them back in the shop.',
  },
  {
    id: 'egg-shelf',
    turn: 4,
    kind: 'move',
    title: 'The egg is always further away',
    momentTitle: 'Alice buys an egg',
    label: 'White Queen · c5 → f8',
    scene: 'egg-shelf',
    motion: { piece: 'white-queen', from: 'c5', to: 'f8' },
    excerpt: "I never put things into people's hands",
    source: chapter('V', 'the egg on the shelf'),
    chess:
      'On the board, the White Queen moves from c5 to f8 while Alice remains at d5. In the story, the Queen is still the Sheep in the shop; the board move does not describe her leaving Alice.',
    story:
      'Back in the shop, Alice buys one egg, although two would cost less. As Alice walks towards the egg, it seems to move farther away, and the shop slowly becomes a forest. A little brook appears among the trees.',
  },
  {
    id: 'humpty',
    turn: 5,
    kind: 'move',
    title: 'An egg with an opinion',
    momentTitle: 'Alice meets Humpty Dumpty',
    label: 'Alice · d5 → d6',
    scene: 'humpty',
    motion: { piece: 'alice', from: 'd5', to: 'd6' },
    excerpt: 'When I use a word',
    source: chapter('VI', 'Humpty Dumpty on meaning'),
    chess:
      'Alice steps forward to d6. The White King is still on c6, immediately to her left. The egg on its wall belongs to the narrative; Carroll’s active diagram has no Humpty piece to capture.',
    story:
      'The egg grows larger and turns into Humpty Dumpty, sitting with his legs crossed on a narrow wall. He tells Alice that names must mean something and argues that there are far more days for un-birthday presents than birthday presents. When she asks about “Jabberwocky,” he explains the first verse, including words like “slithy,” which he says combines “lithe” and “slimy.”',
  },
  {
    id: 'queen-flight',
    turn: 5,
    kind: 'move',
    title: 'Flight across the back rank',
    momentTitle: 'The White Queen flees the woods',
    label: 'White Queen · f8 → c8',
    scene: 'queen-flight',
    motion: { piece: 'white-queen', from: 'f8', to: 'c8' },
    excerpt: "There's the White Queen running across the country!",
    source: chapter('VII', 'Alice spots the White Queen during the Lion and Unicorn episode'),
    chess:
      'The White Queen slides along the eighth rank through e8 and d8 to c8. The Red Knight is still on g8. It does not attack f8: its available on-board targets there are e7, f6, and h6.',
    story:
      'Alice meets a Lion and a Unicorn fighting for the White King’s crown, though the King says the winner will not get it. While the Lion and Unicorn take a break, Alice spots the White Queen running out of the forest and asks the King to help her. He thinks an enemy may be chasing her, but she runs too fast for him to catch. He takes out his notebook to write something down instead.',
    rule: {
      title: 'A story motive is not a chess threat',
      text: 'Do not invent an earlier knight move to make the Queen’s flight necessary. The printed positions are coherent as an authored diagram even where the story’s motive is figurative.',
    },
  },
  {
    id: 'forest',
    turn: 6,
    kind: 'move',
    title: 'The Plum Cake and the Drums',
    momentTitle: 'Alice shares the plum cake',
    label: 'Alice · d6 → d7',
    scene: 'woodland',
    motion: { piece: 'alice', from: 'd6', to: 'd7' },
    excerpt: 'sprang across the little brook in her terror',
    source: chapter(
      'VII',
      'Alice shares the plum cake before the drums drive her across the brook',
    ),
    chess:
      'Alice reaches d7, one square short of the eighth rank. The kings remain at c6 and e4. Nothing has moved to repair the turn order: the sequence continues to follow Carroll’s list.',
    story:
      'Alice tries to slice a plum cake for the Lion, Unicorn, and King, but it keeps joining back together. Following the Unicorn’s advice, she passes it around first, and it divides into three pieces. Suddenly, drums thunder around them. Alice leaps across a nearby brook into the woods and drops to her knees, covering her ears while the empty dish lies beside her.',
  },
  {
    id: 'knight-check',
    turn: 6,
    kind: 'move',
    title: '“Ahoy! Ahoy! Check!”',
    momentTitle: 'The Red Knight tries to capture Alice',
    label: 'Red Knight · g8 → e7 · check',
    scene: 'knight-check',
    motion: { piece: 'red-knight', from: 'g8', to: 'e7' },
    excerpt: "You're my prisoner!",
    source: chapter('VIII', 'the Red Knight arrives'),
    chess:
      'The Red Knight jumps from g8 to e7, a normal knight’s L-shaped move. From e7 it attacks c6, the White King’s square. It also attacks d5, f5, g6, c8, and g8; d9 and f9 lie off the board.',
    story:
      'When the drumming dies away, Alice lifts her head. A Knight in red armor gallops up, shouting “Ahoy! Ahoy! Check!” His horse stops abruptly, and he cries “You’re my prisoner!” as he tumbles off. Once back in the saddle, he starts to repeat his claim, but a second voice cries “Check!” as the White Knight arrives to challenge him.',
    rule: {
      title: 'The king is in check',
      text: 'The knight on e7 attacks the king on c6 by moving two files and one rank. White’s next printed event really does answer this check by capturing the attacker.',
    },
  },
  {
    id: 'knight-capture',
    turn: 7,
    kind: 'capture',
    title: 'The Battle of the Knights',
    momentTitle: 'The White Knight rescues Alice',
    label: 'White Knight · f5 → e7 · captures Red Knight',
    scene: 'forest',
    motion: { piece: 'white-knight', from: 'f5', to: 'e7', captured: 'red-knight' },
    excerpt: 'Yes, but then I came and rescued her!',
    source: chapter('VIII', 'the White Knight’s reply'),
    chess:
      'The White Knight jumps from f5 to e7 and removes the Red Knight. The checking piece is gone, so the White King on c6 is safe from that attack. This is the first capture in the printed scheme.',
    story:
      'The White Knight claims to have rescued Alice, so the two riders fight for her under their Rules of Battle. Both repeatedly tumble from their horses, while Alice shelters behind a tree. The White Knight is declared the winner and the Red Knight gallops away.',
  },
  {
    id: 'knight-return',
    turn: 7,
    kind: 'move',
    title: 'The end of his move',
    momentTitle: 'The White Knight says goodbye',
    label: 'White Knight · e7 → f5',
    scene: 'knight-return',
    motion: { piece: 'white-knight', from: 'e7', to: 'f5' },
    excerpt: "That's the end of my move.",
    source: chapter('VIII', 'the Knight’s escort'),
    chess:
      'The White Knight returns to f5. The captured Red Knight stays off the board: going back to the same square does not undo the earlier capture. From f5 the White Knight will later cover d4, d6, e3, e7, g3, g7, h4, and h6.',
    story:
      'The White Knight escorts Alice through the woods, explaining his inventions and repeatedly tumbling from his horse. Before turning back, he sings her a melancholy song. Alice waits while he rides away, waving her handkerchief goodbye.',
    rule: {
      title: 'A second White move',
      text: 'The return is a legal knight trajectory. Playing it immediately after White’s capture is an irregular turn sequence. Those are different claims about the same entry.',
    },
  },
  {
    id: 'arrival',
    turn: 8,
    kind: 'move',
    title: 'The eighth square at last',
    momentTitle: 'Alice crosses the last brook',
    label: 'Alice · d7 → d8 · still a pawn',
    scene: 'arrival',
    motion: { piece: 'alice', from: 'd7', to: 'd8' },
    excerpt: 'The Eighth Square at last!',
    source: chapter('VIII', 'crossing the last brook'),
    chess:
      'Alice reaches d8. We deliberately retain her pawn shape here. Carroll lists this arrival under turn 8, then lists becoming a Queen separately under turn 9.',
    story:
      'Once the White Knight is out of sight, Alice runs down the hill and leaps across the last brook onto a lawn as soft as moss. As she settles down to rest, she discovers a heavy golden crown on her head.',
    rule: {
      title: 'A pawn held on the eighth rank',
      text: 'In ordinary chess promotion happens as part of the pawn’s move to the last rank. This intermediate pawn-on-d8 state preserves Carroll’s ordering; it is not a playable tournament position.',
    },
  },
  {
    id: 'examination',
    turn: 8,
    kind: 'move',
    title: 'An examination for a queen',
    momentTitle: 'The Queens test Alice',
    label: 'Red Queen · h5 → e8 · check',
    scene: 'palace',
    motion: { piece: 'red-queen', from: 'h5', to: 'e8' },
    excerpt: "You can't be a Queen, you know, till you've passed the proper examination.",
    source: chapter('IX', 'the Red Queen’s examination'),
    chess:
      'The Red Queen travels diagonally through g6 and f7 to e8. From e8 she attacks the White King on c6 along e8–d7–c6. Alice has just vacated d7, so the diagonal is open.',
    story:
      'Alice sits on the lawn with the Red and White Queens close beside her. Despite the crown she already wears, they insist on examining her before accepting her as a queen. Arithmetic, manners, and riddles turn into a scolding.',
    rule: {
      title: 'A check left unanswered',
      text: 'The White King is now in check. The following promotion and palace entries do not answer it. Keep the King on c6 and the check visible: quietly moving the King would falsify Carroll’s scheme.',
    },
  },
  {
    id: 'promotion',
    turn: 9,
    kind: 'promotion',
    title: 'Alice becomes a Queen',
    label: 'Alice · pawn → queen on d8',
    scene: 'promotion',
    excerpt: 'It was a golden crown.',
    source: chapter('VIII', 'Alice discovers the golden crown after crossing the last brook'),
    chess:
      'Only Alice’s type changes: pawn becomes queen on d8. Her identity and square remain the same. White now has two queens: Alice on d8 and the original White Queen on c8.',
    story:
      'The heavy golden crown is Alice’s at last. She has crossed every brook and reached the eighth square. Now she is a queen herself, though the other Queens seem determined to find fault with everything she says.',
    rule: {
      title: 'Promotion does not resolve check',
      text: 'Changing Alice’s type on d8 neither blocks e8–d7–c6 nor captures the Red Queen. The attack on the White King persists through the palace sequence.',
    },
  },
  {
    id: 'queens-palace',
    turn: 9,
    kind: 'palace',
    title: 'A place at her own table',
    momentTitle: 'Alice joins the Queens at the feast',
    label: 'The Queens trade places',
    scene: 'feast-arrival',
    excerpt: 'Queens castle',
    source: { url: sourceRoot, locator: 'Front matter · turn 9, second column' },
    chess:
      'Carroll calls the palace entrance “Queens castle.” In this telling, the Queens trade places around Alice on d8. The Red Queen takes the left side and the White Queen the right. The next printed entry, “Alice Castles (feast),” brings Alice to the table while she stays on d8.',
    story:
      'The Red and White Queens fall asleep in Alice’s lap, then vanish as their snoring becomes a song about a feast. Alice finds a door marked QUEEN ALICE, with bells for visitors and servants. It opens to the sound of guests singing her name, and she enters to find the Queens already seated. Alice takes the empty chair between them.',
    rule: {
      title: '“Castling” is a metaphor here',
      text: 'In chess, castling moves a king and a rook. The exchange shown here stages the palace entrance. Carroll gives neither Queen a destination square. His printed positions resume with the soup episode.',
    },
  },
  {
    id: 'alice-palace',
    turn: 10,
    kind: 'palace',
    title: 'A place at her own table',
    momentTitle: 'Alice enters her feast',
    label: 'Story event · Alice “castles” · no piece moves',
    scene: 'feast-arrival',
    excerpt: "There ought to be one marked 'Queen,'",
    source: chapter('IX', 'the palace doorbells'),
    chess:
      'Alice remains a queen on d8. This is a separate palace entrance from the previous event, even though all piece placements are identical. The Red Queen still checks c6.',
    story:
      'Alice stands before an arched doorway marked QUEEN ALICE. Its two bell handles are labeled for visitors and servants; she wants a bell marked for a Queen. After a frustrating exchange with a Frog, the door opens to a welcoming song, and she enters the feast. The Red and White Queens are already seated.',
    rule: {
      title: 'A second unchanged position',
      text: 'Carroll gives Alice’s arrival at the feast its own entry. On the board, all three queens keep their squares.',
    },
  },
  {
    id: 'soup',
    turn: 10,
    kind: 'move',
    title: 'The White Queen in the soup',
    momentTitle: 'The White Queen vanishes into the soup',
    label: 'White Queen · c8 → a6',
    scene: 'feast',
    motion: { piece: 'white-queen', from: 'c8', to: 'a6' },
    excerpt: 'Here I am!',
    source: chapter('IX', 'the soup-tureen'),
    chess:
      'The original White Queen moves diagonally through b7 to a6. Alice stays on d8. From a6 the White Queen controls d3 along b5–c4–d3; that square will matter to the final mate.',
    story:
      'As Alice begins her speech, the feast turns topsy-turvy: candles stretch to the ceiling and bottles sprout wings. A roast leg of mutton has taken the White Queen’s chair. “Here I am!” calls the Queen from the large bowl of soup. Alice sees her smiling face peep over the rim before she disappears into the soup.',
    rule: {
      title: 'Useful geometry, ignored check',
      text: 'The queen’s path is clear, but this move does not answer the Red Queen’s attack on the White King. From a6 the White Queen also has a clear line to her own King on c6 through b6; a piece cannot check its own king. Carroll continues the feast while a standard game would require an immediate defense.',
    },
  },
  {
    id: 'checkmate',
    turn: 11,
    kind: 'capture',
    title: 'Alice takes the Red Queen.',
    momentTitle: 'Alice catches the Red Queen',
    label: 'Alice, White Queen · d8 → e8 · captures Red Queen · checkmate',
    scene: 'capture',
    motion: { piece: 'alice', from: 'd8', to: 'e8', captured: 'red-queen' },
    excerpt: "I'll shake you into a kitten, that I will!",
    source: chapter('IX', 'Alice seizes the Red Queen'),
    chess:
      'Alice captures the Red Queen on e8 and checks the Red King on e4 down the clear e-file: e7, e6, e5. The king cannot go to e3 or e5, which Alice controls. The White Knight on f5 covers d4 and e3; the White King on c6 covers d5; the White Rook on f1 covers f3, f4, and f5; and the White Queen on a6 covers d3. All eight neighboring squares are covered, including f5 where taking the Knight would expose the king to the Rook.',
    story:
      'Alice can stand the feast no longer. She pulls the tablecloth, sending the dishes and guests tumbling. The Red Queen has dwindled to the size of a doll and runs across the table after her trailing shawl. Alice catches her as she jumps over a bottle, determined to shake her into a kitten.',
    rule: {
      title: 'The final position really is mate',
      text: 'Red has only its King remaining. It cannot capture the distant checking Queen, interpose another piece, or escape to any safe neighboring square. The final capture is sound chess geometry, reached by Carroll’s irregular story sequence.',
    },
  },
];

/** Each event owns complete immutable snapshots. Navigation never reverses moves. */
export const sourceEvents: readonly StoryEvent[] = (() => {
  let board = initialBoard;
  return entries.map((entry) => {
    const before = board;
    board = board.map((piece): Piece => {
      if (entry.motion?.captured === piece.id) return { ...piece, square: null };
      if (entry.motion?.piece === piece.id) return { ...piece, square: entry.motion.to };
      if (entry.kind === 'promotion' && piece.id === 'alice') return { ...piece, type: 'queen' };
      return { ...piece };
    });
    return { ...entry, before, board };
  });
})();

/** Resolve printed entries and older bookmarks to their illustrated moment. */
function momentForEntry(id: string): string {
  if (id === 'white-queen-meeting') return 'shawl';
  if (id === 'alice-palace') return 'queens-palace';
  return id;
}

export const story = sourceEvents.filter((event) => momentForEntry(event.id) === event.id);

/** Cite each printed entry covered by a scene, in Carroll’s column order. */
export function chessCitationsFor(event: StoryEvent) {
  if (event.kind === 'initial') return [{ label: 'Front matter · starting diagram', quote: event.excerpt }];
  return transcription.events.flatMap((entry, index) => {
    if (momentForEntry(entry.id) !== event.id) return [];
    const column = index % 2 === 0 ? 'left' : 'right';
    const pages = (entry.pages.length > 1 ? 'pp. ' : 'p. ') + entry.pages.join(', ');
    return [{ label: `Printed chess list · turn ${entry.turn}, ${column} column · list cites ${pages}`, quote: entry.printed }];
  });
}

/** Stage the two palace entrances while keeping the printed positions for later moves. */
export function displayedPosition(event: StoryEvent, beforeMove = false): BoardSnapshot {
  const position = beforeMove ? event.before : event.board;
  if (event.kind !== 'palace' || (event.id === 'queens-palace' && beforeMove)) return position;
  return position.map((piece) => {
    if (piece.id === 'red-queen') return { ...piece, square: 'c8' };
    if (piece.id === 'white-queen') return { ...piece, square: 'e8' };
    return piece;
  });
}

/** A stable story link that readers can copy or reopen. */
export function storyMomentHref(eventId: string): string {
  return `#moment-${eventId}`;
}

export function storyMomentIndex(hash: string): number {
  if (!hash.startsWith('#moment-')) return -1;
  const id = momentForEntry(hash.slice('#moment-'.length));
  return story.findIndex((event) => event.id === id);
}

export function characterRole(piece: Piece, event: StoryEvent): string {
  if (piece.id === 'alice')
    return piece.type === 'queen'
      ? 'Alice has reached the eighth square and become a queen. The crown is heavy, and being a queen is turning out to be stranger than she imagined.'
      : 'Alice takes Lily’s place as the White Queen’s pawn. Beyond the brooks and woods lies the eighth square, where she hopes to become a queen.';
  if (piece.id === 'white-queen')
    return ['sheep', 'river', 'egg-shelf'].includes(event.id)
      ? 'Where the White Queen stood, Alice now finds a Sheep with knitting needles. Her little shop is full of things that disappear whenever Alice looks straight at them.'
      : 'The White Queen is forever losing her shawl and getting her hair in a tangle. Her memory works both ways, and she promises jam every other day, but never today.';
  if (piece.id === 'red-queen')
    return 'The Red Queen lays down the rules of this curious country. She expects perfect manners, gives brisk directions, and can run as fast as the wind without getting anywhere.';
  if (piece.id === 'white-knight')
    return event.turn < 7
      ? 'A White Knight waits on f5. Alice has yet to meet this gentle rider with his curious inventions.'
      : 'The gentle White Knight has rescued Alice. He has an invention for every difficulty, though none seems to keep him from falling off his horse.';
  if (piece.id === 'red-knight')
    return 'The Red Knight rides in crimson armor and is quick to claim a prisoner. Alice will need a friend when he comes galloping through the woods.';
  if (piece.id === 'white-king')
    return 'The White King keeps his crown and his notebook close at hand. When the White Queen runs past, he would sooner write a memorandum than try to catch her.';
  if (piece.id === 'red-king')
    return 'The Red King sleeps while the world bustles around him. Tweedledee and Tweedledum say that Alice herself is only a thing in his dream.';
  return 'The White Rook keeps a quiet watch from f1 while Alice sets off across the Looking-Glass country.';
}
export function motionLabel(motion: Motion): string {
  return `${motion.from} → ${motion.to}`;
}
