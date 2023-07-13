import React from 'react';
import styled from 'styled-components';

import { QuestionMarkIcon } from '@/icons';
import { breakpoints, fontSizes } from '@/styles';

import { CardSize, CardWrapper, CardContentContainer, TooltipIcon } from './CardStyles';

type ElementProps = {
  backgroundLight?: boolean;
};

export type ProgressBarCardProps = {
  progress: number;
  progressBarLabels: {
    topLeft?: React.ReactNode;
    topRight?: React.ReactNode;
    bottomLeft?: React.ReactNode;
    bottomRight?: React.ReactNode;
  };
  title: string;
  size: CardSize;
  tooltip?: string;
} & ElementProps;

const ProgressBarCard: React.FC<ProgressBarCardProps> = ({
  backgroundLight,
  progress,
  progressBarLabels: { topLeft, topRight, bottomLeft, bottomRight },
  title,
  size,
  tooltip,
}) => (
  <CardWrapper size={size}>
    <StyledProgressBarCard backgroundLight={backgroundLight}>
      <CardContentContainer>
        <TopContainer>
          <TitleContainer>
            <Title>{title}</Title>
            {tooltip && (
              <TooltipIcon>
                <QuestionMarkIcon />
              </TooltipIcon>
            )}
          </TitleContainer>
        </TopContainer>
        <div>
          {(topLeft || topRight) && (
            <TopLabels>
              {topLeft && <LeftLabel>{topLeft}</LeftLabel>}
              {topRight && <RightLabel>{topRight}</RightLabel>}
            </TopLabels>
          )}
          <ProgressBarBackground backgroundLight={backgroundLight}>
            <ProgressBarProgress style={{ width: `${progress * 100}%` }} />
          </ProgressBarBackground>
          {(bottomLeft || bottomRight) && (
            <BottomLabels>
              {bottomLeft && <LeftLabel>{bottomLeft}</LeftLabel>}
              {bottomRight && <RightLabel>{bottomRight}</RightLabel>}
            </BottomLabels>
          )}
        </div>
      </CardContentContainer>
    </StyledProgressBarCard>
  </CardWrapper>
);

const StyledProgressBarCard = styled.div<ElementProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ backgroundLight, theme }) =>
    backgroundLight ? theme.layerlight : theme.layerdark};
`;

const TopContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  ${fontSizes.size20}
  color: ${({ theme }) => theme.textbase};
`;

const LabelContainer = styled.div`
  ${fontSizes.size15};
  display: flex;
  justify-content: space-between;
  letter-spacing: 0;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

const TopLabels = styled(LabelContainer)`
  margin-bottom: 0.75rem;
`;

const BottomLabels = styled(LabelContainer)`
  margin-top: 0.75rem;
`;

const LeftLabel = styled.div`
  color: ${({ theme }) => theme.textlight};
`;

const RightLabel = styled.div`
  color: ${({ theme }) => theme.textdark};
  margin-left: auto;
`;

const ProgressBarBackground = styled.div<ElementProps>`
  display: flex;
  width: 100%;
  height: 0.375rem;
  background-color: ${({ backgroundLight, theme }) =>
    backgroundLight ? theme.layerdark : theme.layerlight};
  border-radius: 0.1875rem;
`;

const ProgressBarProgress = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colorpurple};
  border-radius: 0.1875rem;
`;

export default ProgressBarCard;
