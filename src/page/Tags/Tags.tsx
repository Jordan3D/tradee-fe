import './style.scss';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { Tree } from './components/Tree';
import { GlobalContext } from '../../state/context';
import { TTagForm, Form } from './components/Form';

const TagsPage = (): ReactElement => {

    const { tagsListHandler } = useContext(GlobalContext);
    const [ setForm, setSetForm ] = useState<TTagForm| undefined>(undefined);

    const onSetForm = (value: Readonly<{ id?: string, parentId?: string }>) => () => {
        console.log(value);
        setSetForm(value)
    }

    const onCloseForm = () => {
        setSetForm(undefined);
    };

    useEffect(() => {
        tagsListHandler();
    }, [tagsListHandler])

    return <Page>
        <>
            <Header>
                <>Header</>
            </Header>
            <div className="tags_page__root">
                <Tree
                    className="tags_page__tree"
                    onSetForm={onSetForm}
                />
                <div className="tags_page__tag-info">
                    {setForm && <Form id={setForm.id} parentId={setForm.parentId} onClose={onCloseForm}/>}
                </div>
            </div>
        </>
    </Page>
};

export default TagsPage;