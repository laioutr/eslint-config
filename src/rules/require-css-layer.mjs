/**
 * ESLint rule: require-css-layer
 *
 * Ensures all top-level CSS in Vue <style> blocks is wrapped in an @layer at-rule.
 * Top-level comments outside @layer are allowed.
 */

/**
 * Checks whether a single `;`-terminated statement is acceptable at the top level.
 * Allowed:
 * - empty (whitespace only)
 * - any at-rule that carries a `layer(<ident>)` clause (e.g. `@import url(...) layer(foo);`)
 *
 * @param {string} stmt
 * @returns {boolean}
 */
function isAllowedTopLevelStatement(stmt) {
  const trimmed = stmt.trim();
  if (!trimmed) return true;
  return /^@\w[\w-]*\b[\s\S]*\blayer\s*\(/.test(trimmed);
}

/**
 * Checks whether CSS content has any top-level rules not inside an @layer block.
 * Uses a brace-depth tracking approach — no postcss dependency required.
 *
 * Top-level content is allowed when:
 * - it is fully inside `@layer <name> { ... }` blocks, or
 * - it is an at-rule statement (ending in `;`) that includes a `layer(<ident>)` clause,
 *   such as `@import url('./x.css') layer(foo);`.
 *
 * @param {string} css
 * @returns {boolean} true if all top-level CSS is inside @layer (or only comments/allowed statements)
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
        // The buffer holds everything since the previous `}` (or start of input).
        // Split it into `;`-terminated statements; the final chunk is the header of the block we're entering.
        const parts = buffer.split(';');
        const header = parts.pop() ?? '';
        for (const part of parts) {
          if (!isAllowedTopLevelStatement(part)) {
            return false;
          }
        }
        // The rule that owns these braces must be @layer.
        if (!header.trim().match(/^@layer\b/)) {
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

  // Trailing content outside braces — every statement must be allowed.
  if (buffer.trim()) {
    for (const part of buffer.split(';')) {
      if (!isAllowedTopLevelStatement(part)) {
        return false;
      }
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
