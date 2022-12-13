import React, { useState } from 'react';
import styled from 'styled-components';

import { withLocalization } from 'hoc';
import { useMagicAuth } from 'hooks';
import { AppleIcon, GoogleIcon, EmailSignInIcon } from 'icons';
import { breakpoints, fonts, fontSizes } from 'styles';
import { LocalizationProps } from 'types';

import Button, { ButtonColor } from 'components/Button';

import { STRING_KEYS } from 'constants/localization';

enum MagicOAuthProvider {
  APPLE = 'apple',
  GOOGLE = 'google',
}

export type SignInWithMagicOptionsProps = {
  goToSignInWithEmailStep: () => void;
} & LocalizationProps;

const SignInWithMagicOptions: React.FC<SignInWithMagicOptionsProps> = ({
  goToSignInWithEmailStep,
  stringGetter,
}) => {
  const magicAuth = useMagicAuth();

  const [loginProvider, setLoginProvider] = useState<MagicOAuthProvider | null>(null);

  const onLoginClick = async (provider: MagicOAuthProvider) => {
    setLoginProvider(provider);

    try {
      // @ts-ignore
      await magicAuth.oauth.loginWithRedirect({
        provider,
        redirectURI: new URL('/magic-redirect', window.location.origin).href,
        scope: ['email'],
      });
    } catch (e) {
      setLoginProvider(null);
    }
  };

  return (
    <MagicLinkContainer>
      <h3>{stringGetter({ key: STRING_KEYS.SIGN_IN_VIA_MAGIC })}</h3>
      <MagicLinkOptionsContainer>
        <Button
          color={ButtonColor.Lighter}
          onClick={goToSignInWithEmailStep}
          disabled={!!loginProvider}
        >
          <EmailIcon />
          {stringGetter({ key: STRING_KEYS.EMAIL })}
        </Button>
        <Button
          color={ButtonColor.Lighter}
          onClick={() => onLoginClick(MagicOAuthProvider.APPLE)}
          disabled={!!loginProvider}
          isLoading={loginProvider === MagicOAuthProvider.APPLE}
        >
          <AppleIcon />
          Apple
        </Button>
        <Button
          color={ButtonColor.Lighter}
          onClick={() => onLoginClick(MagicOAuthProvider.GOOGLE)}
          disabled={!!loginProvider}
          isLoading={loginProvider === MagicOAuthProvider.GOOGLE}
        >
          <GoogleIcon />
          Google
        </Button>
      </MagicLinkOptionsContainer>
    </MagicLinkContainer>
  );
};

const MagicLinkContainer = styled.section`
  > h3 {
    ${fonts.medium}
    ${fontSizes.size18};
    color: ${({ theme }) => theme.textlight};
    display: flex;
    align-items: center;

    @media ${breakpoints.tablet} {
      ${fontSizes.size20};
    }
  }
`;

const MagicLinkOptionsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 16px;

  button {
    ${fontSizes.size13}
    border: 1px solid var(--color-border-lighter);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    height: 88px;
    width: 100%;

    @media ${breakpoints.tablet} {
      ${fontSizes.size15}
    }

    :disabled {
      opacity: 0.5;
    }

    > svg {
      height: 38px;
      width: 38px;
    }
  }
`;

const EmailIcon = styled(EmailSignInIcon)`
  > * {
    fill: currentColor;
  }
`;

export default withLocalization(SignInWithMagicOptions);
