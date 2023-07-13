import React from 'react';
import styled from 'styled-components';

import { CtaConfig } from '@/types';
import { fontSizes, breakpoints } from '@/styles';

import Button, { ButtonColor } from '@/components/Button';

type CtaConfigs = {
  primary: CtaConfig;
  secondary?: CtaConfig;
};

export type WithDetailFooterProps = {
  children: React.ReactNode;
  ctaConfigs?: CtaConfigs;
  isDisabled?: boolean;
  label?: string;
  value?: React.ReactNode;
};

const WithDetailFooter: React.FC<WithDetailFooterProps> = ({
  children,
  ctaConfigs,
  isDisabled,
  label,
  value,
}) => (
  <StyledWithDetailFooter>
    <Children>{children}</Children>
    <DetailFooter>
      <LabelValue>
        {value}
        <Label>{label}</Label>
      </LabelValue>
      {isDisabled && <DisabledOverlay />}
      <ButtonContainer>
        {ctaConfigs?.secondary && (
          <Button
            disabled={ctaConfigs.secondary.disabled}
            color={ButtonColor.Light}
            linkOutIcon={ctaConfigs.secondary.linkOutIcon}
            onClick={ctaConfigs.secondary.onClick}
          >
            {ctaConfigs.secondary.label}
          </Button>
        )}
        {ctaConfigs?.primary && (
          <Button
            disabled={ctaConfigs.primary.disabled}
            linkOutIcon={ctaConfigs.primary.linkOutIcon}
            onClick={ctaConfigs.primary.onClick}
          >
            {ctaConfigs.primary.label}
          </Button>
        )}
      </ButtonContainer>
    </DetailFooter>
  </StyledWithDetailFooter>
);

const StyledWithDetailFooter = styled.div`
  display: inline-flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.layerdarker};
`;

const Children = styled.div`
  @media ${breakpoints.desktopSmall} {
    > div {
      width: 100%;
    }
  }
`;

const DetailFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 1rem 0 1.5rem;
  height: 4.75rem;
  width: 100%;
`;

const LabelValue = styled.div`
  ${fontSizes.size20}
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.textlight};
`;

const Label = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

const ButtonContainer = styled.div`
  display: flex;

  > button:not(:last-child) {
    margin-right: 0.75rem;
  }
`;

const DisabledOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.textbase};
  background: rgba(18, 18, 29, 0.8);
  user-select: none;
  cursor: not-allowed;
`;

export default WithDetailFooter;
