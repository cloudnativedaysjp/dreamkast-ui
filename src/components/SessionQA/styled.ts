import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  padding: 16px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`

export const SortButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const SortButton = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${(props) => (props.active ? '#1976d2' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${(props) => (props.active ? '#1565c0' : '#f5f5f5')};
  }
`

export const EmptyText = styled.div`
  text-align: center;
  color: #666;
  padding: 24px;
`
