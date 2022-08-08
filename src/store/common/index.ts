import { combineReducers } from '@reduxjs/toolkit';
import meta from './meta';
import tags from './tags';
import notes from './notes';

const reducer = combineReducers({
    meta,
    tags,
    notes
});

export default reducer;