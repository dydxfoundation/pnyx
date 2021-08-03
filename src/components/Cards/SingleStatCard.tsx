import React from 'react';
import styled from 'styled-components/macro';

import { CtaConfig } from 'types';

import { QuestionMarkIcon } from 'icons';
import { breakpoints, fontSizes } from 'styles';

import Button, { ButtonSize } from 'components/Button';
import LoadingBar from 'components/LoadingBar';
import { CardSize, CardWrapper, CardContentContainer, TooltipIcon, CardColor } from './CardStyles';

type ElementProps = {
  color?: CardColor;
  onClick?: () => void;
};

export type SingleStatCardProps = {
  title: string;
  size?: CardSize;
  tooltip?: string;
  ctaConfig?: CtaConfig;
  isLoading?: boolean;
  value: React.ReactNode;
  label?: React.ReactNode;
} & ElementProps;

const SingleStatCard: React.FC<SingleStatCardProps> = ({
  color,
  title,
  size = CardSize.Medium,
  tooltip,
  ctaConfig,
  onClick,
  isLoading,
  value,
  label,
}) => (
  <CardWrapper smallViewportAutoHeight size={size}>
    <StyledSingleStatCard role="button" color={color} onClick={onClick}>
      <CardContentContainer>
        <TopContainer>
          <TitleContainer>
            <Title>{title}</Title>
            {tooltip && (
              <TooltipIcon>
                <QuestionMarkIcon />
              </TooltipIcon>
            )}
            {ctaConfig && (
              <ButtonContainer>
                <Button size={ButtonSize.Medium} {...ctaConfig}>
                  {ctaConfig.label}
                </Button>
              </ButtonContainer>
            )}
          </TitleContainer>
        </TopContainer>
        <ValueContainer>
          {isLoading ? <LoadingBar height={2.125} width={6} /> : value}
          {label && <Label>{label}</Label>}
        </ValueContainer>
      </CardContentContainer>
    </StyledSingleStatCard>
  </CardWrapper>
);

const StyledSingleStatCard = styled.div<ElementProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) =>
    props.color === CardColor.Light ? props.theme.layerlight : props.theme.layerdark};

  ${(props) =>
    props.onClick
      ? `
        cursor: pointer; 

        &:hover {
          filter: brightness(1.1);

          ${Label} {
            color: ${props.theme.textbase};
          }
        }
      `
      : ''}
`;

const TopContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
`;

const Title = styled.div`
  ${fontSizes.size20}
  color: ${(props) => props.theme.textbase};
  hyphens: auto;
`;

const ValueContainer = styled.div`
  ${fontSizes.size26}
  color: ${(props) => props.theme.textlight};
  margin-top: 0.75rem;
`;

const ButtonContainer = styled.div`
  padding-left: 1rem;
  margin: -0.25rem -0.5rem -0.625rem auto;
`;

const Label = styled.div`
  ${fontSizes.size15}
  color: ${(props) => props.theme.textdark};
  margin-top: 0.125rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export default SingleStatCard;
