import './style.scss';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { NotesContext } from '../../state/notePageContext';
import { List } from './component/List';
import { Form, TNoteForm } from './component/Form';

const NotesPage = (): ReactElement => {

    const { noteListHandler } = useContext(NotesContext);
    const [formValues, setFormValues] = useState<TNoteForm | undefined>(undefined);

    const onCloseForm = () => {
        setFormValues(undefined);
    };

    const onSelectNote = (id: string) => {
        setFormValues({ id });
    };

    useEffect(() => {
        noteListHandler({});
    }, [noteListHandler])

    return <Page>
        <div className="notes_page__root">
            <div className="notes_page__list">
                <List selectedItem={formValues?.id} onSelectItem={onSelectNote} />
            </div>
            <div className="notes_page__item">
                {formValues && <Form values={formValues} onClose={onCloseForm} onSelectNote={onSelectNote}/>}
            </div>
        </div>
    </Page>
};

export default NotesPage;