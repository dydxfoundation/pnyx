import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';

import { AppRoute } from '@/enums';
import { CtaConfig } from '@/types';

import { breakpoints, fontSizes } from '@/styles';
import { ArrowLeftIcon } from '@/icons';

import Button from '@/components/Button';

type InfoModuleConfig = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export type DetailPageHeaderProps = {
  ctaConfig?: CtaConfig;
  infoModuleConfigs?: InfoModuleConfig[];
  label: string;
  subtitle: string;
  title: string;
};

const DetailPageHeader: React.FC<DetailPageHeaderProps & RouteComponentProps> = ({
  ctaConfig,
  history,
  infoModuleConfigs,
  label,
  title,
  subtitle,
}) => (
  <StyledDetailPageHeader>
    <TitleArrowContainer>
      <BackArrow onClick={() => history.push(AppRoute.Dashboard)}>
        <ArrowLeftIcon />
      </BackArrow>
      <TitleContainer>
        <Label>{label}</Label>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TitleContainer>
    </TitleArrowContainer>
    <InfoCtaContainer>
      {infoModuleConfigs &&
        _.map(infoModuleConfigs, ({ label: infoModuleLabel, value: infoModuleValue }) => (
          <InfoModule key={infoModuleLabel as string}>
            <InfoModuleLabel>{infoModuleLabel}</InfoModuleLabel>
            <InfoModuleValue>{infoModuleValue}</InfoModuleValue>
          </InfoModule>
        ))}
      {ctaConfig && (
        <CtaContainer>
          <Button
            disabled={ctaConfig.disabled}
            onClick={ctaConfig.onClick}
            isLoading={ctaConfig.isLoading}
          >
            {ctaConfig.label}
          </Button>
        </CtaContainer>
      )}
    </InfoCtaContainer>
  </StyledDetailPageHeader>
);

const StyledDetailPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  margin-top: -3rem;

  @media ${breakpoints.tablet} {
    flex-direction: column;
    padding: 0 1.5rem;
  }
`;

const TitleArrowContainer = styled.div`
  display: flex;
  align-items: center;

  @media ${breakpoints.tablet} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BackArrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  min-height: 2rem;
  width: 2rem;
  min-width: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.layerlighter};
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    filter: brightness(1.1);
  }
`;

const TitleContainer = styled.div`
  margin-left: 1rem;
  padding-right: 1.5rem;

  @media ${breakpoints.tablet} {
    padding-right: 0;
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const Label = styled.div`
  ${fontSizes.size12}
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size13}
  }
`;

const Title = styled.div`
  ${fontSizes.size24};
  color: ${({ theme }) => theme.textlight};
  margin-top: 0.125rem;
  hyphens: auto;

  @media ${breakpoints.tablet} {
    ${fontSizes.size28}
    margin: 0.25rem 0;
  }
`;

const Subtitle = styled.div`
  ${fontSizes.size16};
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.5rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size17}
  }
`;

const InfoCtaContainer = styled.div`
  display: flex;
  align-items: center;

  @media ${breakpoints.tablet} {
    margin-top: 1.5rem;
  }

  @media ${breakpoints.mobile} {
    padding: 0.25rem;
  }
`;

const InfoModule = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 4.25rem;
  padding: 0 1.25rem 0.25rem;

  background-image: ${(props) =>
    `linear-gradient(${props.theme.bordergrey} 40%, rgba(255, 255, 255, 0) 0%)`};
  background-position: right;
  background-size: 0.0625rem 0.5rem;
  background-repeat: repeat-y;

  @media ${breakpoints.tablet} {
    ${fontSizes.size13}
    align-items: flex-start;
    justify-content: flex-start;
    border-right: none;
    padding: 0 1rem;

    background-image: none;

    &:first-child {
      margin-left: -1rem;
    }

    @media ${breakpoints.mobile} {
      padding: 0 0.75rem;
    }
  }
`;

const InfoModuleLabel = styled.div`
  ${fontSizes.size13}
  text-transform: uppercase;
  color: ${({ theme }) => theme.textdark};
  letter-spacing: 0.08rem;
  white-space: nowrap;
`;

const InfoModuleValue = styled.div`
  ${fontSizes.size18}
  color: ${({ theme }) => theme.textbase};
  margin-top: 0.375rem;
  white-space: nowrap;
`;

const CtaContainer = styled.div`
  padding-left: 1.5rem;

  @media ${breakpoints.tablet} {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
  }
`;

export default withRouter(DetailPageHeader);
