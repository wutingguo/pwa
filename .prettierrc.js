module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  printWidth: 100,
  importOrder: [
    '^@resource/components/((?!pwa).)*$',
    '^@resource/components/(.*)$',
    '^@resource/lib/saas/(.*)$',
    '^@resource/lib/utils/(.*)$',
    '^@resource/lib/constants/(.*)$',
    '^@resource/lib/(.*)$',
    '^@resource/pwa/bootstrap(.*)$',
    '^@resource/pwa/redux(.*)$',
    '^@resource/pwa/utils(.*)$',
    '^@resource/pwa/services(.*)$',
    '^@resource/pwa/(.*)$',
    '^@resource/(.*)$',
    '^@common/components/(.*)$',
    '^@common/hooks/(.*)$',
    '^@common/constants(.*)$',
    '^@common/utils(.*)$',
    '^@common/servers(.*)$',
    '^@common/(.*)$',
    '^@apps/(.*)$',
    '^@gallery/(.*)$',
    '^@src/redux/(.*)$',
    '^@src/containers/(.*)$',
    '^@src/components/(.*)$',
    '^@src/constants/(.*)$',
    '^@src/utils(.*)$',
    '^@src/styles(.*)$',
    '^@src/(.*)$',
    '^../(.*)',
    '^./((?!scss).)*$',
    '^./(.*)',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['jsx', 'decorators-legacy'],
  // plugins: ['@trivago/prettier-plugin-sort-imports'],
};
