import React from 'react';
import styled from 'styled-components';

import type { LocalizationProps } from '@/types';
import { withLocalization } from '../hoc';

import { Icon } from './Icon';
import { DiscourseIcon, DiscordIcon, TwitterIcon } from '../icons';

import { STRING_KEYS } from '../constants/localization';

const links: {
  labelKey: string;
  href: string;
  isExternalLink?: boolean;
  sublinks?: {
    labelKey: string;
    descriptionKey: string;
    href: string;
    icon?: React.FC;
    isExternalLink?: boolean;
  }[];
}[] = [
  {
    labelKey: STRING_KEYS.ABOUT,
    href: '#',
    sublinks: [
      {
        labelKey: STRING_KEYS.TERMS_OF_USE,
        descriptionKey: STRING_KEYS.TERMS_OF_USE_DESCRIPTION,
        href: 'https://dydx.foundation/terms',
        isExternalLink: true,
      },
      {
        labelKey: STRING_KEYS.PRIVACY_POLICY,
        descriptionKey: STRING_KEYS.PRIVACY_POLICY_DESCRIPTION,
        href: 'https://dydx.foundation/privacy',
        isExternalLink: true,
      },
      {
        labelKey: STRING_KEYS.REVOLVING_CREDIT_AGREEMENT,
        descriptionKey: STRING_KEYS.REVOLVING_CREDIT_AGREEMENT_DESCRIPTION,
        href: 'https://dydx.foundation/revolving-credit-agreement',
        isExternalLink: true,
      },
    ],
  },
  {
    labelKey: STRING_KEYS.COMMUNITY,
    href: '#',
    sublinks: [
      {
        labelKey: STRING_KEYS.DISCORD,
        descriptionKey: STRING_KEYS.DISCORD_DESCRIPTION,
        href: 'https://discord.gg/Tuze6tY',
        icon: DiscordIcon,
        isExternalLink: true,
      },
      {
        labelKey: STRING_KEYS.TWITTER,
        descriptionKey: STRING_KEYS.TWITTER_DESCRIPTION,
        href: 'https://twitter.com/dydxfoundation',
        icon: TwitterIcon,
        isExternalLink: true,
      },
      {
        labelKey: STRING_KEYS.FORUMS,
        descriptionKey: STRING_KEYS.FORUMS_DESCRIPTION,
        href: 'https://dydx.forum/',
        icon: DiscourseIcon,
        isExternalLink: true,
      },
    ],
  },
];

const Sitemap: React.FC<LocalizationProps> = ({ stringGetter }) => (
  <StyledSitemap>
    <nav>
      {links.map((link) => (
        <section key={link.labelKey}>
          <h3>
            {link.href ? (
              <a
                href={link.href}
                {...(link.isExternalLink ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {stringGetter({ key: link.labelKey })}
              </a>
            ) : (
              stringGetter({ key: link.labelKey })
            )}
          </h3>
          {link.sublinks?.map((sublink) => (
            <a
              key={sublink.labelKey}
              href={sublink.href}
              {...(sublink.isExternalLink ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <h4>
                <Icon icon={sublink.icon} />
                {stringGetter({ key: sublink.labelKey })}
              </h4>
              <span>{stringGetter({ key: sublink.descriptionKey })}</span>
            </a>
          ))}
        </section>
      ))}
    </nav>
  </StyledSitemap>
);

export default withLocalization(Sitemap);

const StyledSitemap = styled.footer`
  --color-text-light: #f7f7f7;
  --color-text-base: #c3c2d4;
  --color-text-dark: #6f6e84;

  --color-border-grey: #2d2d3d;
  --color-border-lighter: #393953;

  display: flex;
  justify-content: center;
  z-index: 1;

  background-color: ${({ theme }) => theme.layerbase};
  box-shadow: 0px 0px 24px 8px rgba(26, 26, 39, 0.5);
  border-top: 1px solid var(--color-border-grey);

  width: 100%;
  margin-top: 1.5rem;
  padding-top: 1.5rem;

  color: var(--color-text-base);

  * {
    margin: 0;
  }

  a {
    color: inherit;
    cursor: pointer;
    text-decoration: none;

    transition: filter 0.2s;

    &:hover {
      filter: brightness(1.5);
    }
  }

  > nav {
    display: grid;
    width: 100%;
    justify-content: center;
    align-items: start;
    grid-template-columns: repeat(auto-fit, 14rem);
    gap: 1rem;

    > section {
      display: grid;

      > h3 {
        display: none;
        padding: 1rem;
      }

      > a {
        display: grid;
        padding: 1em;
        gap: 0.33em;

        > h4 {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;

          font-weight: 500;
          color: var(--color-text-base);

          gap: 0.5rem;
        }

        > span {
          color: var(--color-text-dark);
          font-size: 0.825rem;
        }
      }
    }
  }
`;
