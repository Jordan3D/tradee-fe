import { Drawer } from 'antd';
import { ReactElement, useState } from 'react';
import { Page } from '../../components/Page';
import { List } from './component/List';
import { Form, TIdeaForm } from './component/Form';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ItemTitle from '../../components/Form/ItemTitle';

const Container = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    margin: 0 auto;
    padding-left: 3rem;

    .title {
        margin: 0 !important;
        height: auto;
    }

    @media screen and (max-width: 1200px){
        flex-direction: column;
    } 
        
    .notes_page {
     &__list {
        display: flex;
        flex-shrink: 0;
        width: 18rem;
        background: white;
    }

    &__item {
        display: flex;
        border: 1px solid #00000099;
        background: white;
    }
    }
`;

const Ideas = (): ReactElement => {
    const { id } = useParams();
    const [formValues, setFormValues] = useState<TIdeaForm>({ id });

    const onCloseForm = () => {
        setFormValues({});
    };

    const onSelectItem = (id: string) => {
        setFormValues({ id });
    };

    return <Container>
        <List selectedItem={formValues?.id} onSelectItem={onSelectItem} />
        <Drawer destroyOnClose closable={false} width={1000} title={<ItemTitle className='title'>{formValues?.id === 'new' ? 'New idea' : 'Edit idea'}</ItemTitle>} placement="right" onClose={onCloseForm} visible={!!formValues?.id}>
            <Form values={formValues} onClose={onCloseForm} onSelectItem={onSelectItem} />
        </Drawer>
    </Container>
};

const IdeasPage = (): ReactElement => <Page isSecure><Ideas /></Page>

export default IdeasPage;