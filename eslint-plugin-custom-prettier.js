import prettierPlugin from 'eslint-plugin-prettier';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let prettierFormat;
function getPrettierFormat() {
  if (!prettierFormat) {
    const { createSyncFn } = require('synckit');
    const path = require('node:path');
    const prettierPluginPath = path.join(
      require.resolve('eslint-plugin-prettier/package.json'),
      '../worker.mjs'
    );
    prettierFormat = createSyncFn(prettierPluginPath);
  }
  return prettierFormat;
}

const originalPrettierRule = prettierPlugin.rules.prettier;

const { showInvisibles, generateDifferences } = require('prettier-linter-helpers');

function getLocFromIndex(sourceCode, index) {
  if (typeof sourceCode.getLocFromIndex === 'function') {
    return sourceCode.getLocFromIndex(index);
  }

  const text = sourceCode.text;
  let line = 1;
  let column = 0;

  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') {
      line++;
      column = 0;
    } else {
      column++;
    }
  }

  return { line, column };
}

const plugin = {
  meta: {
    name: 'custom-prettier',
    version: '1.0.0',
  },
  rules: {
    'prettier': {
      meta: originalPrettierRule.meta,
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const filepath = context.filename ?? context.getFilename();
        const onDiskFilepath = context.physicalFilename ?? context.getPhysicalFilename();
        const source = sourceCode.text;

        const options = context.options?.[1];
        const usePrettierrc = !options || options.usePrettierrc !== false;
        const fileInfoOptions = options?.fileInfoOptions || {};
        const eslintPrettierOptions = context.options?.[0] || {};

        const parser = context.languageOptions?.parser;

        return {
          [sourceCode.ast.type](node) {
            const format = getPrettierFormat();

            let prettierSource;
            try {
              prettierSource = format(
                source,
                {
                  ...eslintPrettierOptions,
                  filepath,
                  onDiskFilepath,
                  parserMeta: parser && (parser.meta ?? { name: parser.name, version: parser.version }),
                  parserPath: context.parserPath,
                  usePrettierrc,
                },
                fileInfoOptions,
              );
            } catch (err) {
              if (!(err instanceof SyntaxError)) {
                throw err;
              }

              let message = 'Parsing error: ' + err.message;
              const error = err;

              if (error.codeFrame) {
                message = message.replace(`\n${error.codeFrame}`, '');
              }
              if (error.loc) {
                message = message.replace(/ \(\d+:\d+\)$/, '');
                context.report({ message, loc: error.loc });
              } else {
                context.report({ message, node });
              }

              return;
            }

            if (prettierSource == null) {
              return;
            }

            if (source !== prettierSource) {
              const differences = generateDifferences(source, prettierSource);

              const filteredDifferences = differences.filter(diff => {

                if (diff.operation === 'replace') {
                  const deleteText = diff.deleteText || '';
                  const insertText = diff.insertText || '';

                  const deleteNormalized = deleteText.replace(/\s+/g, ' ').trim();
                  const insertNormalized = insertText.replace(/\s+/g, ' ').trim();

                  if (deleteNormalized.startsWith('(') && deleteNormalized.endsWith(')')) {
                    const withoutParens = deleteNormalized.slice(1, -1).trim();

                    if (insertNormalized === withoutParens) {
                      return false;
                    }

                    const deleteWithoutAllParens = withoutParens.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
                    const insertWithoutAllParens = insertNormalized.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();

                    if (deleteWithoutAllParens === insertWithoutAllParens) {
                      return false;
                    }
                  }
                }

                return true;
              });

              for (const difference of filteredDifferences) {
                const { operation, offset, deleteText = '', insertText = '' } = difference;
                const range = [offset, offset + deleteText.length];
                const [start, end] = range.map(index => getLocFromIndex(sourceCode, index));

                context.report({
                  messageId: operation,
                  data: {
                    deleteText: showInvisibles(deleteText),
                    insertText: showInvisibles(insertText),
                  },
                  loc: { start, end },
                  fix: fixer => fixer.replaceTextRange(range, insertText),
                });
              }
            }
          },
        };
      },
    },
  },
};

export default plugin;
