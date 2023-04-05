import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import { StringGetterFunction } from '@/types';
import { STRING_KEYS } from '@/constants/localization';

const useGetCountdownDiff = ({
  futureDateISO,
  stringGetter,
}: {
  futureDateISO: string | undefined;
  stringGetter: StringGetterFunction;
}): string | undefined => {
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);
  const [diffString, setDiffString] = useState<string | undefined>();

  const [timeoutFunction, setTimeoutFunction] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );

  const stopCountdown = () => {
    setCountdownStarted(false);

    if (timeoutFunction) {
      clearTimeout(timeoutFunction);
      setTimeoutFunction(null);
    }
  };

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

    setTimeoutFunction(
      setTimeout(updateDiffString, Number(import.meta.env.VITE_COUNTDOWN_POLL_MS))
    );
  };

  useEffect(() => {
    if (!countdownStarted && futureDateISO) {
      setCountdownStarted(true);
      updateDiffString();
    }

    return () => stopCountdown();
  }, [futureDateISO]);

  useEffect(() => stopCountdown(), []);

  return diffString;
};

export default useGetCountdownDiff;
