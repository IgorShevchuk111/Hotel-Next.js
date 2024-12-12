import { unstable_noStore } from 'next/cache';
import { getCabins } from '../_lib/data-service';
import CabinCard from './CabinCard';

async function CabinList() {
  // unstable_noStore(); // Disable caching for this component's data
  const cabins = await getCabins(); // Always fetch fresh data
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {cabins.length > 0 &&
        cabins.map((cabin) => <CabinCard cabin={cabin} key={cabin.id} />)}
    </div>
  );
}

export default CabinList;
