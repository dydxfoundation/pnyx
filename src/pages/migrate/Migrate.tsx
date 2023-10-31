import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styled, { css } from 'styled-components';

import { LocalizationProps } from '@/types';
import { ExternalLink } from '@/enums';
import { LogoXIcon } from '@/icons';
import { withLocalization } from '@/hoc';
import { breakpoints, fontSizes } from '@/styles';

import { STRING_KEYS } from '@/constants/localization';

import Button, { ButtonColor } from '@/components/Button';
import SectionHeader from '@/components/SectionHeader';
import SectionWrapper from '@/components/SectionWrapper';

export type MigrateProps = {} & LocalizationProps;

const BRIDGE_OPTIONS = [
  {
    icon: <LogoXIcon />,
    label: 'bridge.dydx.trade',
    href: ExternalLink.BridgeLink,
    learnMoreHref: ExternalLink.MigrationDocs,
  },
];

const Migrate: React.FC<MigrateProps> = ({ stringGetter }) => (
  <SectionWrapper column>
    <SectionHeader noPadding title={stringGetter({ key: STRING_KEYS.BRIDGES })} />

    <Styled.Description>
      {stringGetter({ key: STRING_KEYS.BRIDGES_DESCRIPTION })}
    </Styled.Description>

    <div>
      {BRIDGE_OPTIONS.map(({ icon, label, href, learnMoreHref }) => (
        <Styled.BridgeOptionRow key="label">
          <div>
            {icon}
            {label}
          </div>
          <div>
            {learnMoreHref && (
              <Button color={ButtonColor.Lighter} href={learnMoreHref} linkOutIcon>
                {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
              </Button>
            )}
            <Button href={href} linkOutIcon>
              {stringGetter({ key: STRING_KEYS.MIGRATE })}
            </Button>
          </div>
        </Styled.BridgeOptionRow>
      ))}
    </div>

    <Styled.BridgeNotes>
      <span>{stringGetter({ key: STRING_KEYS.PLEASE_NOTE })}</span>

      <ol>
        <li>{stringGetter({ key: STRING_KEYS.BRIDGES_NOTE_1 })}</li>
        <li>{stringGetter({ key: STRING_KEYS.BRIDGES_NOTE_2 })}</li>
        <li>{stringGetter({ key: STRING_KEYS.BRIDGES_NOTE_3 })}</li>
        <li>{stringGetter({ key: STRING_KEYS.BRIDGES_NOTE_4 })}</li>
        <li>{stringGetter({ key: STRING_KEYS.BRIDGES_NOTE_5 })}</li>
        <li
          dangerouslySetInnerHTML={{
            __html: stringGetter({
              key: STRING_KEYS.BRIDGES_NOTE_6,
              params: {
                HERE: ReactDOMServer.renderToString(
                  <a href={ExternalLink.MigrationDocs} target="_blank" rel="noopener noreferrer">
                    {stringGetter({
                      key: STRING_KEYS.HERE,
                    })}
                  </a>
                ),
                DYDX_FOUNDATION_BLOG: ReactDOMServer.renderToString(
                  <a href={ExternalLink.FoundationBlog} target="_blank" rel="noopener noreferrer">
                    {stringGetter({ key: STRING_KEYS.DYDX_FOUNDATION_BLOG })}
                  </a>
                ),
              },
            }),
          }}
        />
      </ol>
    </Styled.BridgeNotes>
  </SectionWrapper>
);

// eslint-disable-next-line
const Styled: any = {};

Styled.Description = styled.p`
  color: ${({ theme }) => theme.textdark};
`;

Styled.BridgeOptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.75rem 0;
  overflow-x: scroll;

  min-height: 6rem;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  color: ${({ theme }) => theme.textlight};
  background-color: ${({ theme }) => theme.layerlight};
  ${fontSizes.size20}

  > * {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media ${breakpoints.mobile} {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

Styled.BridgeNotes = styled.div`
  margin: 1.25rem 0;
  border-radius: 0.75rem;
  padding: 1.25rem 0 0.5rem;
  background-color: transparent;
  border-radius: 0.75rem;
  color: ${({ theme }) => theme.textdark};

  background-image: ${({ theme }) =>
    css`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='0.75rem' ry='0.75rem' stroke='%23${theme.layerlighter.replace(
      '#',
      ''
    )}' stroke-width='0.125rem' stroke-dasharray='6%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`};
  background-position: center;

  > * {
    padding: 0 1.25rem;
  }

  li {
    color: ${({ theme }) => theme.textbase};
    margin: 0.5rem 0 0 1.25rem;
  }

  a {
    color: ${({ theme }) => theme.colorpurple};
    text-decoration: none;
    cursor: pointer;

    &:visited {
      color: ${({ theme }) => theme.colorpurple};
    }

    &:hover {
      color: ${({ theme }) => theme.colorpurple};
      text-decoration: underline;
    }
  }
`;

export default withLocalization(Migrate);
