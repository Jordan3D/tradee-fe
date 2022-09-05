import { combineReducers } from '@reduxjs/toolkit';
import meta from './meta';
import tags from './tags';
import notes from './notes';
import pairs from './pairs';
import brokers from './brokers';
import ideas from './ideas';

const reducer = combineReducers({
    meta,
    tags,
    notes,
    pairs,
    brokers,
    ideas
});

export default reducer;