import { Button } from "antd";
import styled from "styled-components";

const MainButton = styled(Button)`
 height: auto;
 padding: 1rem;
 font-size: 1.2rem;
 font-weight: 500;
 text-shadow: 1px 1px 1px rgb(165 177 233);
 background: transparent;
 border: 1px dashed lightgray;
 border-radius: 0.3rem;
 box-shadow: ${props => props.theme.shadows.button()};
 margin: 0 1rem;

 &:hover {
  text-shadow: none;
 }

 &.journal {
  border-color: lightgreen;
  color: #42a442;

  &:hover {
    border-color: #42a442;
  }
 }
 &.note {
  border-color: lightpink;
  color: #e98393;

  &:hover {
    border-color: #e98393;
  }
 }
 &.tag {
  border-color: #d3d3a4;
  color: #cdcd41;

  &:hover {
    border-color: #cdcd41;
  }
 }
`;

export default MainButton;