import { visit } from 'unist-util-visit';

export function stripPostFooter() {
  return (tree) => {
    // Find where the boilerplate starts
    let cutoffIndex = -1;

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      // Match the "Thanks for Reading" phrase
      if (
        node.type === 'paragraph' &&
        node.children?.some(
          (c) => c.type === 'text' && c.value.includes('Thanks for Reading')
        )
      ) {
        cutoffIndex = i;
        break;
      }
    }

    // Drop all nodes from the boilerplate to the end
    if (cutoffIndex !== -1) {
      tree.children.splice(cutoffIndex);
    }
  };
}