import './style.scss';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { NotesContext } from '../../state/notePageContext';
import { List } from './component/List';

const NotesPage = (): ReactElement => {

    const { noteListHandler } = useContext(NotesContext);
    const [noteId, setNoteId] = useState('');

    const onSelectNote = (id: string) => {
        setNoteId(id);
    };

    useEffect(() => {
        noteListHandler({});
    }, [noteListHandler])

    return <Page>
        <>
            <Header>
                <>Header</>
            </Header>
            <div className="notes_page__root">
                <List selectedItem={noteId} onSelectItem={onSelectNote}/>
            </div>
        </>
    </Page>
};

export default NotesPage;