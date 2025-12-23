// @ts-check
import path from 'path';
import { fileURLToPath } from 'url';
import { themes as prismThemes } from 'prism-react-renderer';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { BASE } from './runtime.config.mjs';

import navbarItems from './navbar-items.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  title: 'Crydon',
  url: 'http://example.com',
  baseUrl: BASE,
  trailingSlash: true,
  favicon: 'img/logo.png',

  staticDirectories: ['static', 'public'],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',                             // docs at root
          sidebarPath: path.join(__dirname, 'sidebars.js'),
          include: ['**/*.md', '**/*.mdx'],
          exclude: ['**/_category_.{json,yml,yaml}'],
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        },
        blog: false,
        pages: false,
        theme: {
          customCss: path.join(__dirname, 'src/globals.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      logo: { alt: 'Crydon', src: 'img/logo.png' },
      items: [
        ...navbarItems,
        { type: 'search', position: 'right' },           // ← search box in header (local)
      ],
    },

    footer: {
      style: 'light',
      links: [
      ],
      copyright: `Crydon — ${new Date().getFullYear()}`,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,     
      respectPrefersColorScheme: false, 
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

  },

  plugins: [
    // Next.js compatibility shims
    function nextCompatAliasPlugin() {
      return {
        name: 'next-compat-alias',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                'next/link': '@docusaurus/Link',
                'next/image': path.join(__dirname, 'src/shims/NextImage.jsx'),
              },
            },
          };
        },
      };
    },

    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: '/',        // important: your docs are served at '/'
        language: ['en', 'ru'],        // index languages you need
        indexBlog: false,
      },
    ],
  ],
};

export default config;
