import * as React from 'react'
import styled, { css, useTheme } from 'styled-components'

import { breakpoints } from '../../styles/breakpoints'
import { Icon } from '../Icon'

const Spacer = styled.span`
  padding-left: 1rem;
`

const StyledButton = styled.button<{
  clear: boolean
  large: boolean
  withIcon: boolean
  round: boolean
}>(
  ({ clear, large, round, withIcon, theme: { color, boxShadow, borderRadius } }) => css`
    outline: none;
    border: 0;
    font-family: 'Hind';
    font-size: 0.9rem;
    border-radius: ${round ? borderRadius.xl : borderRadius.xs};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${withIcon ? '0.4rem' : large ? '0.8rem 0.6rem' : '0.5rem 0.6rem'};
    color: ${clear ? '#999999' : '#cccccc'};

    transition: all 100ms ease-in;
    z-index: 1;
    background-color: ${clear ? '#f0f0f0' : '#880044'};
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
      cursor: pointer;
      background-color: ${clear ? '#e8e8e8' : '#aa0055'};
    }

    &:disabled {
      background-color: ${clear ? '#f0f0f0' : '#880044'};
      opacity: 0.4;
    }

    @media ${breakpoints.M} {
      padding: ${withIcon ? '0.6rem' : large ? '0.9rem 1rem' : '0.6rem 1rem'};
    }
  `
)

type DefaultProps = {
  /**
   * Clear button styles leaving just a text
   */
  clear?: boolean
  round?: boolean
  /**
   * Is the button large?
   */
  large?: boolean
  /**
   * Does the button have an icon?
   */
  icon?: string
  /**
   * Size of the icon
   */
  iconSize?: number
  /**
   * Is the button disabled?
   */
  disabled?: boolean
  /**
   * Does the button have an icon?
   */
  children?: string | React.ReactNode
  /**
   * Optional click handler
   */
  onClick?: () => void
}

type ButtonProps = DefaultProps & React.ComponentProps<typeof StyledButton>

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  large = false,
  clear = false,
  round = false,
  icon,
  iconSize,
  ...props
}: ButtonProps) => {
  const { color } = useTheme()

  return (
    <StyledButton
      type="button"
      large={large}
      clear={clear}
      round={round}
      {...props}
      withIcon={!!icon}
    >
      {icon && <Icon color={clear ? '#999999' : '#cccccc'} size={iconSize} name={icon} />}
      {icon && children && <Spacer />}
      {children}
    </StyledButton>
  )
}
