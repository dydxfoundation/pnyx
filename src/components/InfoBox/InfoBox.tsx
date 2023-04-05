import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

import LearnMoreLink from '@/components/LearnMoreLink';

export type InfoBoxProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  icon?: React.ReactNode;
  learnMoreLink?: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({ title, body, icon, learnMoreLink }) => (
  <StyledInfoBox>
    <Title>
      {icon}
      {title}
    </Title>
    <Body>
      {body}
      {learnMoreLink && (
        <LinkContainer>
          <LearnMoreLink href={learnMoreLink} />
        </LinkContainer>
      )}
    </Body>
  </StyledInfoBox>
);

const StyledInfoBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
`;

const Title = styled.div`
  ${fontSizes.size15}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textlight};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }

  > svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.5rem;
  }
`;

const Body = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textbase};
  margin-top: 0.375rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

const LinkContainer = styled.a`
  display: block;
  margin-top: 0.25rem;
`;

export default InfoBox;
