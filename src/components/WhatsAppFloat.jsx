import { whatsappUrl } from '../lib/content';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFloat() {
  return (
    <a className="wa-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp">
      <WhatsAppIcon width="26" height="26" />
    </a>
  );
}
