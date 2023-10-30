import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled, { AnyStyledComponent } from 'styled-components';

import { LocalizationProps } from '@/types';
import { AppRoute } from '@/enums';

import { withLocalization } from '@/hoc';
import { fontSizes } from '@/styles';

import { STRING_KEYS } from '@/constants/localization';

import Button, { ButtonSize } from './Button';

export type BannerProps = {} & RouteComponentProps & LocalizationProps;

const Banner: React.FC<BannerProps> = ({ history, stringGetter }) => (
  <Styled.Banner>
    <h4>{stringGetter({ key: STRING_KEYS.MIGRATION_BANNER_MESSAGE })}</h4>
    <Button size={ButtonSize.Pill} onClick={() => history.push(AppRoute.Migrate)}>
      {stringGetter({ key: STRING_KEYS.MIGRATE })}
    </Button>
  </Styled.Banner>
);

export default withLocalization(withRouter(Banner));

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Banner = styled.div`
  ${fontSizes.size14}
  position: sticky;
  top: 0;

  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  flex-wrap: wrap;
  justify-content: center;
  height: 3.25rem;
  width: 100vw;
  text-align: center;
  background-color: ${({ theme }) => theme.layerlight};
  border-bottom: solid 1px ${({ theme }) => theme.bordergrey};
  z-index: 2;

  button {
    ${fontSizes.size14}
    border-radius: 0.5rem;
  }
`;
