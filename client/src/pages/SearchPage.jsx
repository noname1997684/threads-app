

import SearchPost from '../components/SearchPost';
import SuggestedUsers from '../components/SuggestedUsers';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [query] = useSearchParams()
  const search= query.get('q')

  return (<>
    {!search ?(<SuggestedUsers/>):(<SearchPost/>)}
    </>
  )
}

export default SearchPage