import { Button, Calendar } from 'antd';
import React, { ReactElement, useEffect } from "react";
import {getUnixTime, startOfMonth, endOfMonth, startOfYear, endOfYear} from 'date-fns';
import type { Moment } from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { IBase } from '../../../../interface/Base';

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

const ItemCounter = styled.div`
     position: absolute;
     top: 0;
     left: 1rem;
     font-size: 1.6rem;
     color: darkcyan;
`;

interface Props<T> {
    data: Record<number, T[]>
    onAdd(date?: string): (e: React.MouseEvent) => void;
    onSetInterval(startDate: number, endDate: number, mode: 'month' | 'year'): void
    onClickCell(n: number): void
}

const CustomCalendar = ({data, onAdd, onSetInterval, onClickCell}:Props<IBase>): ReactElement => {

    const monthCellRender = (value: Moment) => {
        return '';
    };

    const onClickCellHandler = (n: number) => (e: React.MouseEvent) => {
        onClickCell(n);
    }

    const dateCellRender = (value: Moment) => {
        const dateN = value.date();
        return <DateCell onClick={onClickCellHandler(dateN)}>
            <ItemCounter>
                {data[dateN]?.length}
            </ItemCounter>
            <AddButton className='button' onClick={onAdd(value.toISOString())}>
            <PlusOutlined />
            </AddButton>
        </DateCell>
    };

    const onChangeHandler = (date: Moment, mode: string) => {
        if(mode === 'month'){
            onSetInterval(getUnixTime(startOfMonth(date.toDate())), getUnixTime(endOfMonth(date.toDate())), mode);
        }   
        if(mode === 'year') {
            onSetInterval(getUnixTime(startOfYear(date.toDate())), getUnixTime(endOfYear(date.toDate())), mode);
        }
    }
    
    useEffect(() => {
        onSetInterval(getUnixTime(startOfMonth(new Date())), getUnixTime(endOfMonth(new Date())), 'month');
    }, [onSetInterval]);

    return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} onPanelChange={onChangeHandler} />;
};

export default CustomCalendar;