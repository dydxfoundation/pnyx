import React from 'react';
import styled from 'styled-components/macro';
import _ from 'lodash';

import { CtaConfig } from 'types';
import { breakpoints, fontSizes } from 'styles';

import Button, { ButtonColor, ButtonSize } from 'components/Button';

import { CardWrapper, CardContentContainer } from './CardStyles';

type CtaConfigs = {
  primary: CtaConfig;
  secondary?: CtaConfig;
};

export type InfoCtaCardProps = {
  label: string;
  title?: string;
  body?: string;
  ctaConfigs?: CtaConfigs;
};

const InfoCtaCard: React.FC<InfoCtaCardProps> = ({ label, title, body, ctaConfigs }) => {
  const renderButtons = () => {
    if (!ctaConfigs) {
      return null;
    }

    const buttons = [];
    if (ctaConfigs.primary) {
      const { label: primaryLabel, onClick, linkOutIcon } = ctaConfigs.primary;

      buttons.push(
        <Button
          key="primary"
          color={ButtonColor.Lighter}
          size={ButtonSize.Medium}
          linkOutIcon={linkOutIcon}
          onClick={onClick}
        >
          {primaryLabel}
        </Button>
      );
    }

    if (ctaConfigs.secondary) {
      const { label: secondaryLabel, onClick, linkOutIcon } = ctaConfigs.secondary;

      buttons.push(
        <Button
          key="secondary"
          color={ButtonColor.Light}
          size={ButtonSize.Medium}
          linkOutIcon={linkOutIcon}
          onClick={onClick}
        >
          {secondaryLabel}
        </Button>
      );
    }

    return <ButtonContainer>{buttons}</ButtonContainer>;
  };

  return (
    <CardWrapper smallViewportAutoHeight>
      <StyledInfoCtaCard>
        <CardContentContainer>
          <div>
            <Label>{label}</Label>
            {title && <Title>{title}</Title>}
            {body && <Body>{body}</Body>}
          </div>
          {renderButtons()}
        </CardContentContainer>
      </StyledInfoCtaCard>
    </CardWrapper>
  );
};

const StyledInfoCtaCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: transparent;
  border-radius: 0.75rem;

  background-image: ${({ theme }) =>
    `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='0.75rem' ry='0.75rem' stroke='%23${_.replace(
      theme.layerlighter,
      '#',
      ''
    )}' stroke-width='0.125rem' stroke-dasharray='0.375rem 0.5rem' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`};
`;

const Label = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

const Title = styled.div`
  ${fontSizes.size20}
  color: ${({ theme }) => theme.textlight};
  margin-top: 0.25rem;
`;

const Body = styled.div`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textbase};
  margin-top: 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size17}
  }
`;

const ButtonContainer = styled.div`
  display: flex;

  > button:not(:last-child) {
    margin-right: 0.625rem;
  }

  @media ${breakpoints.desktopSmall} {
    margin-top: 1rem;
  }
`;

export default InfoCtaCard;
