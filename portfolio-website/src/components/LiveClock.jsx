import React, { useEffect, useState } from 'react';

const FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/**
 * Singapore local time, ticking. Real data, not decoration — it is the one
 * readout on the page that changes while you look at it, which is what sells
 * the panel as live rather than printed.
 */
export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="instrument live-clock" dateTime={now.toISOString()}>
      SGT {FORMATTER.format(now)}
    </time>
  );
}
