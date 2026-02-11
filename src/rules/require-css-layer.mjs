/**
 * ESLint rule: require-css-layer
 *
 * Ensures all top-level CSS in Vue <style> blocks is wrapped in an @layer at-rule.
 * Top-level comments outside @layer are allowed.
 */

/**
 * Checks whether CSS content has any top-level rules not inside an @layer block.
 * Uses a brace-depth tracking approach — no postcss dependency required.
 *
 * @param {string} css
 * @returns {boolean} true if all top-level CSS is inside @layer (or only comments)
 */
function isAllLayered(css) {
  // Strip block comments
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');

  let depth = 0;
  let buffer = '';

  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];

    if (ch === '{') {
      if (depth === 0) {
        // Check if the accumulated buffer is an @layer declaration
        const trimmed = buffer.trim();
        if (trimmed && !trimmed.match(/^@layer\s/)) {
          return false;
        }
        buffer = '';
      }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        buffer = '';
      }
    } else if (depth === 0) {
      buffer += ch;
    }
  }

  // Check trailing content outside braces (e.g. bare declarations without braces)
  const trailing = buffer.trim();
  if (trailing && !trailing.match(/^@layer\s/)) {
    if (trailing.replace(/[\s;]/g, '').length > 0) {
      return false;
    }
  }

  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
export const requireCssLayer = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require all top-level CSS in Vue <style> blocks to be inside an @layer block',
    },
    messages: {
      missingLayer: 'All top-level CSS must be inside an @layer block.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    if (!sourceCode.parserServices?.getDocumentFragment) {
      return {};
    }
    const documentFragment = sourceCode.parserServices.getDocumentFragment();
    if (!documentFragment) {
      return {};
    }

    const styleTags = documentFragment.children.filter(
      (element) => element.type === 'VElement' && element.rawName === 'style',
    );

    if (styleTags.length === 0) {
      return {};
    }

    return {
      Program() {
        for (const styleTag of styleTags) {
          const textNodes = styleTag.children?.filter((c) => c.type === 'VText') ?? [];
          const cssContent = textNodes.map((t) => t.value).join('');

          if (!cssContent.trim()) continue;

          if (!isAllLayered(cssContent)) {
            context.report({
              node: styleTag,
              messageId: 'missingLayer',
            });
          }
        }
      },
    };
  },
};
