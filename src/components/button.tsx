import React, { CSSProperties } from 'react'

interface ButtonProps {
  text: string
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <button
      style={props.style}
      onClick={props.onClick}
      className={props.className}
    >
      {props.text}
    </button>
  )
}
