import React from 'react';
import '../styles/Panel.css';

/**
 * The bracket-framed surface used for every card-like element on the site.
 *
 * `interactive` is for panels the reader can act on — it adds the lift, the
 * bracket expansion and the accent border. A panel that is purely presentational
 * must not receive it, or the site starts promising affordances it does not have.
 */
export default function Panel(props) {
  const {
    as: Tag = 'div',
    interactive = false,
    className = '',
    children,
    ...rest
  } = props;
  const classes = ['panel', interactive && 'panel--interactive', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
