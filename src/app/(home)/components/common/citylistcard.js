import { useState } from 'react';
import Link from 'next/link';

const CityList = ({ cityList, prefix }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCities = showAll ? cityList : cityList.slice(0, 5);

  return (
    <ul>
      <p className="text-golden">{prefix} India</p>
      {visibleCities.map((item, index) => (
        <li key={`${item.name}-${index}`}>
          <Link className="footer-text" href={`/city/${item.slugUrl}`}>
            {prefix}{item.name}
          </Link>
        </li>
      ))}
      {cityList.length > 5 && (
        <li>
          <button onClick={() => setShowAll(!showAll)} className="btn btn-success btn-background my-3 border-0">
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </li>
      )}
    </ul>
  );
};

export default CityList;
