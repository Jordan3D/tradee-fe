import { Button, Calendar } from 'antd';
import { ReactElement } from "react";
import type { Moment } from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const DateCell = styled.div`
 position: relative;
 width: 100%;
 height: 100%;

 &:hover {
    .button {
        display: flex;
    }
 }
`;

const AddButton = styled(Button)`
 position: absolute;
 display: none;
 bottom: 0.2rem;
 right: 0.2rem;
 padding: 8px;
 border-radius: 2rem;
`;

interface Props {
    onAdd(date?: string): (e: React.MouseEvent) => void
}

const CustomCalendar = ({onAdd}:Props): ReactElement => {

    const monthCellRender = (value: Moment) => {
        return '';
    };

    const dateCellRender = (value: Moment) => {
        return <DateCell>
            <AddButton className='button' onClick={onAdd(value.toISOString())}>
            <PlusOutlined />
            </AddButton>
        </DateCell>
    };

    return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />;
};

export default CustomCalendar;