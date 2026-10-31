import site from '../data/site.json';
import menu from '../data/menu.json';

export { site, menu };

export const itemById = Object.fromEntries(menu.items.map((i) => [i.id, i]));

export const whatsappUrl = (msg = site.contact.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(msg)}`;

export const telUrl = `tel:${site.contact.phoneE164}`;

export const priceLabel = (item) => `${menu.currency}${item.price}`;
