const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Current day key + minutes in the restaurant's own timezone. */
const formatters = {};
function nowIn(timezone) {
  formatters[timezone] ??= new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = formatters[timezone].formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = get('weekday').slice(0, 3).toLowerCase();
  return { day, minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
}

export function openStatus(hours) {
  const { day, minutes } = nowIn(hours.timezone);
  const slots = hours.days[day] || [];
  const current = slots.find(([a, b]) => minutes >= toMin(a) && minutes < toMin(b));
  if (current) return { open: true, label: `Open now · until ${fmt(current[1])}` };
  const later = slots.find(([a]) => toMin(a) > minutes);
  if (later) return { open: false, label: `Closed · opens ${fmt(later[0])}` };
  const next = DAY_KEYS[(DAY_KEYS.indexOf(day) + 1) % 7];
  const first = hours.days[next]?.[0];
  return { open: false, label: first ? `Closed · opens tomorrow ${fmt(first[0])}` : 'Closed' };
}

export function fmt(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hr = h % 12 || 12;
  return m ? `${hr}:${String(m).padStart(2, '0')} ${suffix}` : `${hr} ${suffix}`;
}

export const todayKey = (tz) => nowIn(tz).day;
