import { useEffect } from 'react';
import Story from './Story';
import Bhojanam from './Bhojanam';
import Signature from './Signature';
import Marquee from './Marquee';
import VegMeal from './VegMeal';
import Gallery from './Gallery';
import Reviews from './Reviews';
import Visit from './Visit';
import { KolamDivider } from './Kolam';

/** Everything after the hero, split into its own chunk so the first paint stays light. */
export default function BelowFold({ onMount }) {
  useEffect(() => { onMount?.(); }, [onMount]);
  return (
    <>
      <Story />
      <KolamDivider className="divider" />
      <Bhojanam />
      <Signature />
      <Marquee />
      <VegMeal />
      <KolamDivider className="divider" />
      <Gallery />
      <Reviews />
      <Visit />
    </>
  );
}
