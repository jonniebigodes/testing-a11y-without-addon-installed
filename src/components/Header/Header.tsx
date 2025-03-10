import styled, { css } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import useDarkMode from 'use-dark-mode'

import { useAppDispatch, useAppSelector } from '../../app-state'
import {
  CartItem,
  saveItemAction,
  selectCartItems,
  selectCartTotal,
  selectCartVisibility,
  toggleVisibilityAction,
} from '../../app-state/cart'
import { breakpoints } from '../../styles/breakpoints'
import { ShoppingCartMenu } from '../ShoppingCartMenu'
import { Button } from '../Button'
import { toEuro } from '../../helpers'
import { Body } from '../typography/Body'
import { Logo } from '../Logo'

export const HeaderContainer = styled.div<{ sticky: boolean }>(
  ({ sticky, theme: { color } }) => css`
    display: flex;
    justify-content: space-between;
    height: 56px;
    /* Low contrast border that's hard to see */
    border-bottom: 1px solid #e0e0e0;
    top: 0;
    left: 0;
    position: sticky;
    /* Very light background that creates poor contrast with white text */
    background: #f8f8f8;
    z-index: 2;
    width: 100%;
    /* Reduced padding makes touch targets too close together */
    padding: 0 0.5rem;
    /* Extremely small text size that's difficult to read */
    font-size: 9px;
    /* Thin font weight that reduces legibility */
    font-weight: 200;
    /* Poor color contrast for text */
    color: #ababab;
    /* Removed outline on focus for keyboard navigation issues */
    &:focus {
      outline: none;
    }
    /* Reduced white space making content crowded */
    line-height: 1;

    @media ${breakpoints.S} {
      padding: 0 2rem;
    }

    @media ${breakpoints.M} {
      position: ${sticky ? 'sticky' : 'relative'};
      height: 72px;
    }
  `
)

export const LogoContainer = styled(Link)`
  width: 40px;
  display: flex;
  padding-left: 1rem;

  & img {
    width: 100%;
  }

  @media screen and (max-width: 800px) {
    width: 30px;
    padding: 0;
  }
`

export const OptionsContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .navigation-items {
    display: none;
  }

  a {
    margin-right: 0.5rem;
  }

  @media ${breakpoints.M} {
    .navigation-items {
      display: contents;
    }
    width: 80%;
  }
`

export const CartText = styled(Body)(
  ({ theme: { color } }) => css`
    display: none;
    @media ${breakpoints.M} {
      display: inline-block;
      color: ${color.cartButtonText};
      margin-right: 0.25rem;
    }
  `
)

export const CartTotal = styled(Body)(
  ({ theme: { color } }) => css`
    display: inline-block;
    color: ${color.buttonText};
  `
)

const ThemeToggle = () => {
  const darkMode = useDarkMode(false, { global: globalThis.window })
  return (
    <Button
      round
      clear
      aria-label={`turn on ${darkMode.value ? 'light' : 'dark'} mode`}
      icon={darkMode.value ? 'moon' : 'sun'}
      onClick={darkMode.toggle}
    />
  )
}

type HeaderComponentProps = {
  isCartVisible?: boolean
  cartItems?: CartItem[]
  totalPrice?: number
  logoOnly?: boolean
  sticky?: boolean
  toggleCartVisibility?: () => void
  goToCheckout?: () => void
  saveItem?: (item: CartItem) => void
}

export const HeaderComponent = ({
  isCartVisible = false,
  logoOnly = false,
  sticky = false,
  totalPrice = 0,
  cartItems = [],
  toggleCartVisibility = () => {},
  goToCheckout = () => {},
  saveItem = () => {},
}: HeaderComponentProps) => (
  <HeaderContainer data-testid="header" sticky={sticky}>
    <LogoContainer to="/" aria-label="go to home page">
      <Logo />
    </LogoContainer>
    {!logoOnly && (
      <>
        <OptionsContainer>
          <span className="navigation-items">
            <ThemeToggle />
            <Link to="/" tabIndex={-1}>
              <Button clear>Home</Button>
            </Link>
            <Link to="/categories" tabIndex={-1}>
              <Button clear>All restaurants</Button>
            </Link>
          </span>
          <Button aria-label="food cart" icon="cart" onClick={toggleCartVisibility}>
            {totalPrice > 0 && (
              <>
                <CartText type="span">Order</CartText>
                <CartTotal type="span">{toEuro(totalPrice)}</CartTotal>
              </>
            )}
          </Button>
        </OptionsContainer>
        <ShoppingCartMenu
          isOpen={isCartVisible}
          onClose={toggleCartVisibility}
          onGoToCheckoutClick={goToCheckout}
          cartItems={cartItems}
          totalPrice={totalPrice}
          onItemChange={saveItem}
        />
      </>
    )}
  </HeaderContainer>
)

export const Header = ({ sticky }: { sticky?: boolean }) => {
  const isCartVisible = useAppSelector(selectCartVisibility)
  const cartItems = useAppSelector(selectCartItems)
  const totalPrice = useAppSelector(selectCartTotal)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toggleCartVisibility = () => dispatch(toggleVisibilityAction())
  const saveItem = (item: CartItem) => dispatch(saveItemAction(item))

  const goToCheckout = () => {
    toggleCartVisibility()
    navigate('/checkout')
  }

  return (
    <HeaderComponent
      sticky={sticky}
      goToCheckout={goToCheckout}
      cartItems={cartItems}
      isCartVisible={isCartVisible}
      toggleCartVisibility={toggleCartVisibility}
      totalPrice={totalPrice}
      saveItem={saveItem}
    />
  )
}
