import { combineReducers } from '@reduxjs/toolkit';
import meta from './meta';
import tags from './tags';
import notes from './notes';
import pairs from './pairs';

const reducer = combineReducers({
    meta,
    tags,
    notes,
    pairs
});

export default reducer;