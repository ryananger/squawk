import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax, firebase} from '../util';
import HandleFriend from './HandleFriend.jsx';

const Search = function() {
  var renderResults = function() {
    var rendered = [];

    st.search.map(function(result, i) {
      rendered.push(
        <div key={'result' + i} className='searchResult h'>
          {result.username}
          {result.username !== st.user.username && <HandleFriend entry={result}/>}
        </div>
      )
    })

    return rendered;
  };

  return (
    <div className='search v'>
      <br/>
      <h3>{st.search.length} {st.search.length === 1 ? 'result' : 'results'}</h3>
      <br/>
      {renderResults()}
    </div>
  );
};

export default Search;

