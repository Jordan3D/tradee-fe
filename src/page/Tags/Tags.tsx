import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { Tree } from './components/Tree';
import { GlobalContext } from '../../state/context';
import { TTagForm, Form } from './components/Form';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled.div`
    position: relative;
    display: flex;
    margin: 0 auto;

    @media screen and (max-width: 1200px){
        flex-direction: column;
    }
    
  .tags_page {
    &__tree{
        width: 40%;
        max-width: 620px;
        padding: 10px;
        background-color: white;

        .ant-tree-treenode {
            align-items: center;
        }

        .ant-tree-switcher {
            display: flex;
            justify-content: center;
            align-items: center;
        }


        @media screen and (max-width: 1200px){
            width: 100%;
            max-width: none;
        }
    }
    &__tag-info{
        flex-grow: 1;
        margin-left: 1em;
        background-color: white;

        @media screen and (max-width: 1200px){
            margin-left: 0;
        }
    }
}
`;

const Tags = (): ReactElement => {
    const { id } = useParams();
    const { tagsListHandler } = useContext(GlobalContext);
    const [formValues, setFormValues] = useState<TTagForm>({id});

    const onSetForm = (value: Readonly<{ id?: string, parentId?: string }>) => () => {
        setFormValues(value)
    }

    const onCloseForm = () => {
        setFormValues({});
    };

    useEffect(() => {
        tagsListHandler();
    }, [tagsListHandler])

    return <Container>
        <Tree
            className="tags_page__tree"
            onSetForm={onSetForm}
        />
        <div className="tags_page__tag-info">
            {formValues.id && <Form values={formValues} onClose={onCloseForm} />}
        </div>
    </Container>
};

const TagsPage  = (): ReactElement => <Page isSecure><Tags/></Page>;

export default TagsPage;