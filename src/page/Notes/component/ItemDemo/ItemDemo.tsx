import { ReactElement, useContext } from "react";
import { useSelector } from "react-redux";
import { INoteFull } from "../../../../interface/Note";
import { NotesContext } from "../../../../state/notePageContext";
import { selectTagMap } from "../../../../store/common/tags";
import {Container, ItemTitle, ItemContent, ItemTags, ItemTag} from './style';

const ItemDemo = ({id}: {id: string}):ReactElement => {
    const {map} = useContext(NotesContext);
    const tagMap = useSelector(selectTagMap);
    const {title, content, tags}: INoteFull = map[id] ? map[id] : {} as INoteFull;
    return <Container>
        <ItemTitle className="section">{title}</ItemTitle>
        <ItemContent className="section" dangerouslySetInnerHTML={{ __html: content }}/>
        <ItemTags className="section">
            {tags.map(tag => <ItemTag>{tagMap[tag].title}</ItemTag>)}
        </ItemTags>
    </Container>
};

export default ItemDemo;