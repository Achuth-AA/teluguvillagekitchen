import { useEffect, useState } from 'react';
import { site, telUrl, whatsappUrl } from '../lib/content';
import { openStatus, DAY_LABELS, fmt, todayKey } from '../lib/hours';
import SectionHeading from './SectionHeading';
import Magnetic from './Magnetic';
import { PhoneIcon, WhatsAppIcon, MapIcon } from './Icons';

const ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function Visit() {
  const { contact, hours, brand } = site;
  // The Open/Closed badge and hours table only render once `hours` is added to site.json.
  const [status, setStatus] = useState(() => (hours ? openStatus(hours) : null));
  const today = hours ? todayKey(hours.timezone) : null;
  const a = contact.address;

  useEffect(() => {
    if (!hours) return;
    const id = setInterval(() => setStatus(openStatus(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  return (
    <section id="visit" className="visit" aria-labelledby="visit-title">
      <div className="wrap visit-grid">
        <div className="visit-info">
          <SectionHeading id="visit-title" eyebrow="Visit us" telugu="రండి, తినండి" teluguEn="come, eat" title={<>Pull up a chair <em>in Gachibowli.</em></>} />

          {status && (
            <p className={`status-badge ${status.open ? 'is-open' : 'is-closed'}`} role="status">
              <span className="pulse" aria-hidden="true" />
              {status.label}
            </p>
          )}

          <address className="visit-address">
            <span className="visit-label">Address</span>
            {a.street},<br />
            {a.locality}, {a.region} {a.postalCode}
          </address>

          <p className="visit-service">{brand.serviceNote}</p>

          <div className="visit-actions">
            <Magnetic href={telUrl} className="btn btn-dark"><PhoneIcon /> Call {contact.phoneDisplay}</Magnetic>
            <Magnetic href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><WhatsAppIcon /> WhatsApp</Magnetic>
          </div>

          {hours && (
            <table className="hours">
              <caption>Opening hours</caption>
              <tbody>
                {ORDER.map((d) => (
                  <tr key={d} className={d === today ? 'is-today' : ''}>
                    <th scope="row">{DAY_LABELS[d]}</th>
                    <td>{hours.days[d]?.length ? hours.days[d].map(([o, c]) => `${fmt(o)} – ${fmt(c)}`).join(', ') : 'Closed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="visit-map">
          <iframe
            title="Map showing Telugu Village Kitchen in Gachibowli, Hyderabad"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            width="600"
            height="700"
          />
          <a className="map-link link-draw" href={site.social.find((s) => s.icon === 'map')?.url} target="_blank" rel="noopener noreferrer">
            <MapIcon /> Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
