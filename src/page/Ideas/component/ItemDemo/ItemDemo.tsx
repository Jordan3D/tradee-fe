import { ReactElement, useContext } from "react";
import { useSelector } from "react-redux";
import { IIdea } from "../../../../interface/Idea";
import { IdeasContext } from "../../../../state/ideaPageContext";
import { selectNoteMap } from "../../../../store/common/notes";
import { selectTagMap } from "../../../../store/common/tags";
import {Container, ItemTitle, ItemContent, ItemNotes, ItemTags, ItemImages, ItemTag, ItemNote, ItemImg} from './style';

const ItemDemo = ({id}: {id: string}):ReactElement => {
    const {map} = useContext(IdeasContext);
    const tagMap = useSelector(selectTagMap);
    const noteMap = useSelector(selectNoteMap);
    const {title, content, images, tags, notes}: IIdea = map[id] ? map[id] : {} as IIdea;
    return <Container>
        <ItemTitle className="section">{title}</ItemTitle>
        <ItemContent className="section" dangerouslySetInnerHTML={{ __html: content }}/>
        <ItemTags className="section">
            {tags.map(tag => <ItemTag key={tag}>{tagMap[tag].title}</ItemTag>)}
        </ItemTags>
        <ItemNotes className="section">
            {notes.map(note => <ItemNote key={note}>{noteMap[note]?.title}</ItemNote>)}
        </ItemNotes>
        <ItemImages className="section">
        {images.map(img => <ItemImg key={img.id} src={img.url} alt={img.url}/>)}
        </ItemImages>
    </Container>
};

export default ItemDemo;