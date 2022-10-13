import {getKeysByTitleMatchValue} from './tree'

describe('Test tree utils functionality', () => {
    const data = [{
        key: '1',
        title: 'abba',
        children: [{
            key: '1.1',
            title: 'abba2',
            children: [{
                key: '1.1.1',
                title: 'abba3'
            }]
        }]
    }];

    it('it should return no data', () => {
        expect(getKeysByTitleMatchValue([])).toEqual([])
    })

    it('should be some keys', () => {
        expect(getKeysByTitleMatchValue(data, 'abba2')).toEqual([data[0].key])
    })

    it('should be match on 2nd deep', () => {
        expect(getKeysByTitleMatchValue(data, 'abba')).toEqual([data[0].children[0].key, data[0].key])
    })
   
    it('should be no matches', () => {
        expect(getKeysByTitleMatchValue(data, 'adda')).toEqual([])
    })
});