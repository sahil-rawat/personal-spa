import { visit } from 'unist-util-visit';

const TYPES = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };

/** Turns GitHub-style `> [!NOTE]` blockquotes into styled callout boxes. */
export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children?.[0];
      const text = first?.type === 'paragraph' ? first.children?.[0] : null;
      if (text?.type !== 'text') return;
      const m = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/i.exec(text.value);
      if (!m) return;

      const kind = m[1].toUpperCase();
      text.value = text.value.slice(m[0].length);
      if (!text.value && first.children.length === 1) node.children.shift();

      node.data = {
        hName: 'div',
        hProperties: { className: ['callout', `callout-${kind.toLowerCase()}`], role: 'note' },
      };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: TYPES[kind] }],
      });
    });
  };
}
