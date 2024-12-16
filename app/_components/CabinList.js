import { unstable_noStore } from 'next/cache';
import { getCabins } from '../_lib/data-service';
import CabinCard from './CabinCard';

async function CabinList({ filter }) {
  // unstable_noStore(); // Disable caching for this component's data
  const cabins = await getCabins(); // Always fetch fresh data

  if (!cabins) return null;

  let displayed;
  if (filter === 'all') displayed = cabins;
  if (filter === 'small')
    displayed = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === 'medium')
    displayed = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  if (filter === 'large')
    displayed = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayed.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
