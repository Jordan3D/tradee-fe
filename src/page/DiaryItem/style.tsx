
import { Form as AntdForm} from 'antd';
import styled from 'styled-components';

const Item = AntdForm.Item;

export const Container = styled.div`
display: flex;
justify-content: space-evenly;
flex-direction: column;


.contentWrapper {
    min-height: 40rem;
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .add-btn {
    padding: 0.3rem ${props => props.theme.padding};
    font-size: 1.4rem;
    height: 4.2rem;
  }
`;

export const Buttons = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 1rem 0rem 2rem;
`