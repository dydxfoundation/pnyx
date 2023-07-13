import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { AppDispatch } from '@/store';

import {
  pageLoaded as pageLoadedAction,
  pageSizeChanged as pageSizeChangedAction,
} from '@/actions/page';

const InitializePage: React.FC<ReturnType<typeof mapDispatchToProps>> = ({
  pageLoaded,
  pageSizeChanged,
}) => {
  useEffect(() => {
    pageLoaded();

    pageSizeChanged({
      height: window.visualViewport ? window.visualViewport.height : window.innerHeight,
      width: window.visualViewport ? window.visualViewport.width : window.innerWidth,
    });

    if (window.visualViewport) {
      window.visualViewport.onresize = _.throttle(
        (e) =>
          pageSizeChanged({
            height: e.target.height,
            width: e.target.width,
          }),
        50
      );
    } else {
      window.addEventListener(
        'resize',
        _.throttle(() => {
          pageSizeChanged({
            height: window.innerHeight,
            width: window.innerWidth,
          });
        })
      );
    }
  }, [pageLoaded, pageSizeChanged]);

  return null;
};

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      pageLoaded: pageLoadedAction,
      pageSizeChanged: pageSizeChangedAction,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(InitializePage);
