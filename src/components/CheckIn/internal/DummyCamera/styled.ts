import styled from 'styled-components'

export const DummyCamera = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #000; /* Optional, just to visualize the space */
  //
  @media (max-width: 600px) {
    width: 90vw;
    height: 90vw;
  }
`
