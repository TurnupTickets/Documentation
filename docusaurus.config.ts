import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {createHash} from 'node:crypto';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Load DOCS_PASSWORD from .env (local). In CI it comes from a GitHub secret.
try {
  process.loadEnvFile();
} catch {
  // no .env file - rely on real environment variables
}

const docsPassword = process.env.DOCS_PASSWORD;
if (!docsPassword) {
  throw new Error(
    'DOCS_PASSWORD is not set. Copy .env.example to .env and set a password.',
  );
}
// Only the hash is shipped to the browser, never the plain password.
const docsPasswordHash = createHash('sha256').update(docsPassword).digest('hex');

const config: Config = {
  title: 'Turnup Tickets',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://turnup-tickets.pl',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Documentation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'TurnupTickets', // Usually your GitHub org/user name.
  projectName: 'CMS', // Usually your repo name.

  // Keep the password-protected docs out of search engines.
  noIndex: true,

  customFields: {
    docsPasswordHash,
  },

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'System sprzedaży biletów - Turnup Tickets',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'functional',
          position: 'left',
          label: 'Dokumentacja funkcjonalna',
        },
        {
          type: 'docSidebar',
          sidebarId: 'technical',
          position: 'left',
          label: 'Dokumentacja techniczna',
        },
        {
          href: 'https://github.com/TurnupTickets',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
