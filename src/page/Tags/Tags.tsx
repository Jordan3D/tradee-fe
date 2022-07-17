import './style.scss';
import { ReactElement, useContext, useEffect } from 'react';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { Tree } from './components/Tree';
import { GlobalContext } from '../../state/context';


const TagsPage = (): ReactElement => {

    const {tagList,tagsListHandler} = useContext(GlobalContext);

    useEffect(()=> {
        tagsListHandler();
    }, [tagsListHandler])

    return <Page>
        <>
            <Header>
                <>Header</>
            </Header>
            <div className="tags_page__root">
               <Tree className="tags_page__tree" list={tagList}/>
               <div className="tags_page__tag-info"></div>
            </div>
        </>
    </Page>
};

export default TagsPage;