import React from 'react';
import styled from 'styled-components/macro';
import _ from 'lodash';

import { AssetSymbol } from 'enums';
import { breakpoints, fontSizes } from 'styles';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import LoadingBar from 'components/LoadingBar';

import { CardWrapper, CardContentContainer } from './CardStyles';

type ElementProps = {
  isDisabled?: boolean;
};

type InfoModuleConfig = {
  label: React.ReactNode;
  value: React.ReactNode;
  isLoading?: boolean;
};

export type InfoModuleCardProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  symbol?: AssetSymbol;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  infoModulesConfig: InfoModuleConfig[];
} & ElementProps;

const InfoModuleCard: React.FC<InfoModuleCardProps> = ({
  title,
  subtitle,
  symbol,
  onClick,
  isDisabled,
  infoModulesConfig,
}) => (
  <CardWrapper>
    <StyledInfoModuleCard isDisabled={isDisabled} onClick={onClick}>
      <CardContentContainer>
        <TopContainer>
          <TitleContainer>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleContainer>
          {symbol && <AssetIcon size={AssetIconSize.Large} symbol={symbol} />}
        </TopContainer>
        <InfoModules>
          {_.map(infoModulesConfig, ({ label, value, isLoading }) => (
            <InfoModule key={label as string}>
              <InfoModuleContent>
                {isLoading ? <LoadingBar height={1.5} width={4} /> : value}
                <InfoModuleLabel>{label}</InfoModuleLabel>
              </InfoModuleContent>
            </InfoModule>
          ))}
        </InfoModules>
      </CardContentContainer>
    </StyledInfoModuleCard>
  </CardWrapper>
);

const StyledInfoModuleCard = styled.div<ElementProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => props.theme.layerlight};

  ${(props) =>
    props.onClick
      ? `
        cursor: pointer;
        
        &:hover { 
          filter: brightness(1.1);
        }
      `
      : ''}

  ${(props) =>
    props.isDisabled
      ? `
        cursor: not-allowed;
        opacity: 0.5;
      `
      : ''}
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleContainer = styled.div``;

const Title = styled.div`
  ${fontSizes.size20}
  color: ${(props) => props.theme.textlight};
`;

const Subtitle = styled.div`
  ${fontSizes.size14}
  color: ${(props) => props.theme.textdark};
  margin-top: 0.25rem;
`;

const InfoModules = styled.div`
  display: flex;
  width: 100%;
`;

const InfoModule = styled.div`
  display: flex;
  flex: 1 1 auto;
  padding: 0 0.5rem;

  &:first-child {
    padding: 0 0.5rem 0 0;
  }

  &:last-child {
    padding: 0 0 0 0.5rem;
  }

  &:not(:first-child) {
    justify-content: center;
  }

  &:not(:last-child) {
    border-right: solid 0.0625rem ${(props) => props.theme.bordergrey};
  }
`;

const InfoModuleContent = styled.div`
  ${fontSizes.size20}
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.textlight};
`;

const InfoModuleLabel = styled.div`
  ${fontSizes.size14}
  color: ${(props) => props.theme.textdark};
  margin-top: 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

export default InfoModuleCard;
