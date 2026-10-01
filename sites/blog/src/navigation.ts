import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Work',
      href: getPermalink('/work'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'The Workshop',
      href: getBlogPermalink(),
    },
  ],
  actions: [{ text: 'Contact', variant: 'primary' as const, href: getPermalink('/contact'), target: '_self' }],
};

export const footerData = {
  links: [
    {
      title: '',
      links: [{ text: 'hello@daviddejesus.me', href: 'mailto:hello@daviddejesus.me' }],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Notice', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/arthelokyo/astrowind' },
  ],
  footNote: `
    © 2026 David de Jesús · All rights Reserved.
  `,
};
