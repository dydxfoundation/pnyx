import React from 'react';
import styled, { css } from 'styled-components';

import { CtaConfig } from '@/types';
import { breakpoints, fontSizes } from '@/styles';

import Button, { ButtonColor, ButtonSize } from '@/components/Button';

import { CardWrapper, CardContentContainer } from './CardStyles';

type CtaConfigs = {
  primary: CtaConfig;
  secondary?: CtaConfig;
};

export type InfoCtaCardProps = {
  label: string;
  title?: string;
  body?: React.ReactNode;
  ctaConfigs?: CtaConfigs;
};

const InfoCtaCard: React.FC<InfoCtaCardProps> = ({ label, title, body, ctaConfigs }) => {
  const renderButtons = () => {
    if (!ctaConfigs) {
      return null;
    }

    const buttons = [];
    if (ctaConfigs.primary) {
      const { color, label: primaryLabel, href, onClick, linkOutIcon } = ctaConfigs.primary;

      buttons.push(
        <Button
          key="primary"
          color={color ?? ButtonColor.Lighter}
          href={href}
          size={ButtonSize.Medium}
          linkOutIcon={linkOutIcon}
          onClick={onClick}
        >
          {primaryLabel}
        </Button>
      );
    }

    if (ctaConfigs.secondary) {
      const { color, label: secondaryLabel, href, onClick, linkOutIcon } = ctaConfigs.secondary;

      buttons.push(
        <Button
          key="secondary"
          color={color ?? ButtonColor.Light}
          href={href}
          linkOutIcon={linkOutIcon}
          onClick={onClick}
          size={ButtonSize.Medium}
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
    css`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='0.75rem' ry='0.75rem' stroke='%23${theme.layerlighter.replace(
      '#',
      ''
    )}' stroke-width='0.125rem' stroke-dasharray='6%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`};
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
  margin-top: 1rem;

  > button:not(:last-child) {
    margin-right: 0.625rem;
  }
`;

export default InfoCtaCard;
