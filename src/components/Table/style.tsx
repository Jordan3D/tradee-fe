import styled from "styled-components";

export const Table = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;

  .add_button {
    margin: 2rem;
  }

  table {
    font-size: 1.2rem;
  }

  .list {
    height: 50vw;
    overflow-y: scroll;
    padding: 1rem;
  }

  .table_content {
    height: calc(100% - 10rem);
    width: 100%;
    overflow-y: scroll;
    margin-bottom: 1rem;

  &.tiny {
    height: auto;
  }

  .disabled-row {
    background-color: #dcdcdc;
    pointer-events: none;
  }
}


.ant-pagination {
  height: 10rem;
  display: flex;
  align-items: flex-end;
  justify-content: left;
}
`;