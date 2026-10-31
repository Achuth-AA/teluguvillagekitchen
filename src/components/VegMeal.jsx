import { menu, site, itemById, telUrl, whatsappUrl } from '../lib/content';
import SectionHeading from './SectionHeading';
import Magnetic from './Magnetic';
import { PhoneIcon, WhatsAppIcon } from './Icons';

/** The one offer we highlight: Veg Meals for ₹130. Content from menu.json → vegMeal. */
export default function VegMeal() {
  const cfg = menu.vegMeal;
  const item = itemById[cfg.itemId];
  const review = site.reviews.items.find((r) => r.author === cfg.reviewAuthor);

  return (
    <section id="menu" className="vegmeal" aria-labelledby="vegmeal-title">
      <div className="wrap vegmeal-grid">
        <figure className="vegmeal-img">
          <img src={cfg.image} alt={cfg.imageAlt} width="800" height="700" loading="lazy" decoding="async" />
        </figure>

        <div className="vegmeal-body">
          <SectionHeading
            id="vegmeal-title"
            eyebrow="What we serve"
            telugu={item.telugu}
            teluguEn="veg meals"
            title={<>{item.name}, <em>served hot.</em></>}
          />

          <p className="vegmeal-price" aria-label={`${item.name} costs ${menu.currency}${item.price}`}>
            <span className="vegmeal-currency" aria-hidden="true">{menu.currency}</span>
            <span aria-hidden="true">{item.price}</span>
            <span className="vegmeal-per" aria-hidden="true">per meal</span>
          </p>

          <p className="vegmeal-desc">{item.description}</p>

          {review && (
            <blockquote className="vegmeal-quote">
              <p>&ldquo;{review.text}&rdquo;</p>
              <footer>{review.author} · {site.reviews.source}</footer>
            </blockquote>
          )}

          <div className="vegmeal-actions">
            <Magnetic href={whatsappUrl(`Hello! I'd like to order ${item.name} (${menu.currency}${item.price}).`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon /> Order on WhatsApp
            </Magnetic>
            <Magnetic href={telUrl} className="btn btn-dark"><PhoneIcon /> Call {site.contact.phoneDisplay}</Magnetic>
          </div>
          <p className="vegmeal-note">{site.brand.serviceNote}</p>
        </div>
      </div>
    </section>
  );
}
