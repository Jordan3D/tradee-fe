import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { NotesContext } from '../../state/notePageContext';
import { List } from './component/List';
import { Form, TNoteForm } from './component/Form';
import { GlobalContext } from '../../state/context';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    margin: 0 auto;

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

const Notes = (): ReactElement => {
    const { id } = useParams();
    const { tagsListHandler } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);
    const [formValues, setFormValues] = useState<TNoteForm>({id});

    const onCloseForm = () => {
        setFormValues({});
    };

    const onSelectNote = (id: string) => {
        setFormValues({ id });
    };

    useEffect(() => {
        tagsListHandler();
        noteListHandler({});
    }, [noteListHandler, tagsListHandler])

    return <Container>
        <div className="notes_page__list">
            <List selectedItem={formValues?.id} onSelectItem={onSelectNote}/>
        </div>
        <div className="notes_page__item">
            {formValues.id && <Form values={formValues} onClose={onCloseForm} onSelectNote={onSelectNote} />}
        </div>
    </Container>
};

const NotesPage = ():ReactElement => <Page isSecure><Notes/></Page>

export default NotesPage;