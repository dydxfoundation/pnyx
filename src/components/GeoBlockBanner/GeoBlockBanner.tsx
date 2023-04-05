import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styled from 'styled-components';

import { LocalizationProps } from '@/types';
import { ExternalLink } from '@/enums';

import { withLocalization } from '@/hoc';
import { breakpoints, fontSizes } from '@/styles';
import { BlockedIcon } from '@/icons';

import { STRING_KEYS } from '@/constants/localization';

export type GeoBlockBannerProps = {} & LocalizationProps;

const GeoBlockBanner: React.FC<GeoBlockBannerProps> = ({ stringGetter }) => (
  <StyledGeoBlockBanner>
    <DesktopIcon>
      <BlockedIcon />
    </DesktopIcon>
    <div>
      <Title>
        <TabletIcon>
          <BlockedIcon />
        </TabletIcon>
        {stringGetter({ key: STRING_KEYS.OUTSIDE_US_ACCESS })}
      </Title>

      <Subtitle
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: stringGetter({
            key: STRING_KEYS.OUTSIDE_US_ACCESS_DESCRIPTION,
            params: {
              TERMS_LINK: ReactDOMServer.renderToString(
                <a href={ExternalLink.TermsOfUse} target="_blank" rel="noopener noreferrer">
                  {stringGetter({ key: STRING_KEYS.TERMS_OF_USE })}
                </a>
              ),
            },
          }),
        }}
      />
    </div>
  </StyledGeoBlockBanner>
);

const StyledGeoBlockBanner = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
`;

const DesktopIcon = styled.div`
  margin-right: 1.5rem;

  > svg {
    height: 3rem;
    width: 3rem;
  }

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

const TabletIcon = styled.div`
  display: none;
  align-items: center;
  margin-right: 1rem;

  > svg {
    height: 2.625rem;
    width: 2.625rem;
  }

  @media ${breakpoints.tablet} {
    display: flex;
  }

  @media ${breakpoints.mobile} {
    margin-bottom: 1rem;
  }
`;

const Title = styled.div`
  ${fontSizes.size22}
  display: flex;
  color: ${({ theme }) => theme.textlight};

  @media ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const Subtitle = styled.div`
  ${fontSizes.size16}
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textdark};

  > a {
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

export default withLocalization(GeoBlockBanner);
