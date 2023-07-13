import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@/styles';

import type { LocalizationProps } from '@/types';
import { withLocalization } from '../hoc';

import { Icon } from './Icon';
import { DiscourseIcon, DiscordIcon, TwitterIcon } from '../icons';

import { STRING_KEYS } from '../constants/localization';

const socialLinks: {
  labelKey: string;
  descriptionKey: string;
  href: string;
  icon?: React.FC;
  isExternalLink?: boolean;
}[] = [
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
];

const legalLinks: {
  labelKey: string;
  descriptionKey: string;
  href: string;
  icon?: React.FC;
  isExternalLink?: boolean;
}[] = [
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
];

const Sitemap: React.FC<LocalizationProps> = ({ stringGetter }) => (
  <StyledSitemap>
    <nav>
      <section className="social-links">
        {socialLinks?.map((sublink) => (
          <a
            key={sublink.labelKey}
            href={sublink.href}
            {...(sublink.isExternalLink ? { target: '_blank', rel: 'noreferrer' } : {})}
            title={`${stringGetter({ key: sublink.labelKey })} | ${stringGetter({
              key: sublink.descriptionKey,
            })}`}
          >
            <Icon icon={sublink.icon} />
          </a>
        ))}
      </section>

      <section>
        {legalLinks?.map((sublink) => (
          <a
            key={sublink.labelKey}
            href={sublink.href}
            {...(sublink.isExternalLink ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {stringGetter({ key: sublink.labelKey })}
          </a>
        ))}
      </section>
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

  --icon-size: 2.5;

  display: grid;
  z-index: 1;

  background-color: ${({ theme }) => theme.layerbase};
  box-shadow: 0px 0px 24px 8px rgba(26, 26, 39, 0.5);
  border-top: 1px solid var(--color-border-grey);

  width: 100%;
  margin-top: 1.5rem;
  padding-top: 1.5rem;

  color: var(--color-text-base);
  text-align: center;

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
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media ${breakpoints.mobile} {
      flex-direction: column;
    }

    > section {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      > a {
        display: grid;
        padding: 0.75em 1em;

        > span {
          color: var(--color-text-dark);
          font-size: 0.825rem;
        }
      }
    }
  }
`;
