import './style.scss';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { Tree } from './components/Tree';
import { GlobalContext } from '../../state/context';
import { TTagForm, Form } from './components/Form';

const Tags = (): ReactElement => {

    const { tagsListHandler } = useContext(GlobalContext);
    const [formValues, setFormValues] = useState<TTagForm | undefined>(undefined);

    const onSetForm = (value: Readonly<{ id?: string, parentId?: string }>) => () => {
        console.log(value);
        setFormValues(value)
    }

    const onCloseForm = () => {
        setFormValues(undefined);
    };

    useEffect(() => {
        tagsListHandler();
    }, [tagsListHandler])

    return <div className="tags_page__root">
        <Tree
            className="tags_page__tree"
            onSetForm={onSetForm}
        />
        <div className="tags_page__tag-info">
            {formValues && <Form values={formValues} onClose={onCloseForm} />}
        </div>
    </div>
};

const TagsPage  = (): ReactElement => <Page isSecure><Tags/></Page>;

export default TagsPage;