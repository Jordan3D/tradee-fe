
import { Form as AntdForm} from 'antd';
import styled from 'styled-components';

const Item = AntdForm.Item;

export const Container = styled.div`
display: flex;
justify-content: space-evenly;
flex-direction: column;
`;

export const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  height: 3rem;
  color: black;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: lightgray;
  border: 1px dashed lightgray;
  border-radius: 0.5rem;
`;

export const FormItem = styled(Item)`
   display: flex;
   flex-direction: column;
   width: 100%;
   padding: 1rem;
   // border-bottom: 1px solid black;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Buttons = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 1rem 1rem 2rem;
`