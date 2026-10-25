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
      links: [{ text: 'hello@daviddejesus.me', href: 'mailto:hello@daviddejesus.me' }, { text: 'Privacy Notice', href: getPermalink('/privacy') }],
      
    },
  ],
  secondaryLinks: [
    { text: '', href: getPermalink('') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/davehausus' },
  ],
  footNote: `
    © 2026 David de Jesus · All rights Reserved.
  `,
};
