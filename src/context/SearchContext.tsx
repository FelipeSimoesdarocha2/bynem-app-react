import React, { useState, useContext } from 'react';

import debounce from 'lodash.debounce';

const SearchContext = React.createContext({});

export const useSearch: any = () => useContext(SearchContext);

const SearchProvider = ({children}) => {
  const [search, setSearch] = useState('');

  const onChangeSearch = debounce((value) => {
    setSearch(value);
  }, 500)

  const clearSearch = () => setSearch('');

  const defaultValue = {
    search,
    onChangeSearch,
    clearSearch
  }

  return (
    <SearchContext.Provider value={defaultValue}>{children}</SearchContext.Provider>
  )
}

export default SearchProvider;