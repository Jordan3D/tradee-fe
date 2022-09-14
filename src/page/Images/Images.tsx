import { Drawer } from 'antd';
import { ReactElement, useState } from 'react';
import { Page } from '../../components/Page';
import { List } from './component/List';
import { Form, TNoteForm } from './component/Form';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ItemTitle from '../../components/Form/ItemTitle';

const Container = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    margin: 0 auto;

    .title {
        margin: 0;
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

const Images = (): ReactElement => {
    const { id } = useParams();
    const [formValues, setFormValues] = useState<TNoteForm>({ id });

    const onCloseForm = () => {
        setFormValues({});
    };

    const onSelect= (id: string) => {
        setFormValues({ id });
    };

    return <Container>
        <List selectedItem={formValues?.id} onSelectItem={onSelect} />
        <Drawer destroyOnClose closable={false} width={1000} title={<ItemTitle className='title'>{'Add image'}</ItemTitle>} placement="right" onClose={onCloseForm} visible={!!formValues?.id}>
            <Form values={formValues} onClose={onCloseForm} onSelect={onSelect} />
        </Drawer>
    </Container>
};

const NotesPage = (): ReactElement => <Page isSecure><Images /></Page>

export default NotesPage;