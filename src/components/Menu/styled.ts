import styled from 'styled-components'
import Toolbar from '@material-ui/core/Toolbar'

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.6);
  min-height: 100vh;
`

export const Header = styled(Toolbar)`
  display: flex;
  justify-content: flex-start;
  background-color: #ffffff;
  color: #282828;
`

export const HeaderImg = styled.img`
  height: 40px;
`

export const ChildrenContainer = styled.div`
  padding-bottom: 22px;
`

export const Footer = styled.footer`
  grid-row-start: 2;
  grid-row-end: 3;
  background-color: #fff;
  width: 100%;
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const FooterText = styled.div`
  font-size: 14px;
  color: gray;
`
export const FooterLink = styled.a`
  text-decoration: none;
  font-size: 14px;
  color: gray;
`

export const MenuLink = styled.a`
  text-decoration-line: none;
`

export const DesktopMenu = styled.div`
  display: none;
  justify-content: flex-end;
  margin-left: auto;
  @media (min-width: 600px) {
    display: flex;
  }
`

export const MobileMenu = styled.div`
  display: none;
  justify-content: space-between;
  margin-left: auto;
  @media (max-width: 599px) {
    display: flex;
    width: 100%;
    background-color: #fff;
    padding: 0 20px;
  }
`
