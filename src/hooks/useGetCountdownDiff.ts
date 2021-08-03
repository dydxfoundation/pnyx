import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import { StringGetterFunction } from 'types';
import { STRING_KEYS } from 'constants/localization';

let countdownStarted: boolean = false;
let timeoutFunction: ReturnType<typeof setTimeout> | null;

const useGetCountdownDiff = ({
  futureDateISO,
  stringGetter,
}: {
  futureDateISO: string | undefined;
  stringGetter: StringGetterFunction;
}): string | undefined => {
  const [diffString, setDiffString] = useState<string | undefined>();

  const updateDiffString = () => {
    const { days, hours, minutes } = DateTime.fromISO(futureDateISO as string).diffNow([
      'days',
      'hours',
      'minutes',
    ]);

    setDiffString(
      `${Math.max(Math.floor(days), 0)}${stringGetter({
        key: STRING_KEYS.DAYS_SHORT,
      })} ${Math.max(Math.floor(hours), 0)}${stringGetter({
        key: STRING_KEYS.HOURS_SHORT,
      })} ${Math.max(Math.floor(minutes), 0)}${stringGetter({
        key: STRING_KEYS.MINUTES_SHORT,
      })}`
    );

    timeoutFunction = setTimeout(updateDiffString, Number(process.env.REACT_APP_COUNTDOWN_POLL_MS));
  };

  useEffect(() => {
    if (!countdownStarted && futureDateISO) {
      countdownStarted = true;
      updateDiffString();
    }

    return () => {
      countdownStarted = false;

      if (timeoutFunction) {
        clearTimeout(timeoutFunction);
      }
    };
  }, [futureDateISO]);

  return diffString;
};

export default useGetCountdownDiff;
