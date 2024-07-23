import type { CSSProperties, MouseEventHandler } from 'react';
import React, { forwardRef, useMemo } from 'react';
import { ColorBlock } from '@rc-component/color-picker';
import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';

import type { ColorPickerComponentSharedProps, ColorPickerProps } from '../interface';
import { getColorAlpha } from '../util';
import ColorClear from './ColorClear';

export interface ColorTriggerProps
  extends Pick<ColorPickerComponentSharedProps, 'prefixCls' | 'disabled' | 'format'> {
  color: NonNullable<ColorPickerComponentSharedProps['color']>;
  open?: boolean;
  showText?: ColorPickerProps['showText'];
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

const ColorTrigger = forwardRef<HTMLDivElement, ColorTriggerProps>((props, ref) => {
  const { color, prefixCls, open, disabled, format, className, showText, ...rest } = props;
  const colorTriggerPrefixCls = `${prefixCls}-trigger`;

  const containerNode = useMemo<React.ReactNode>(
    () =>
      color.cleared ? (
        <ColorClear prefixCls={prefixCls} />
      ) : (
        <ColorBlock prefixCls={prefixCls} color={color.toRgbString()} />
      ),
    [color, prefixCls],
  );

  const genColorString = () => {
    const hexString = color.toHexString().toUpperCase();
    const alpha = getColorAlpha(color);
    switch (format) {
      case 'rgb':
        return color.toRgbString();
      case 'hsb':
        return color.toHsbString();
      // case 'hex':
      default:
        return alpha < 100 ? `${hexString.slice(0, 7)},${alpha}%` : hexString;
    }
  };

  const renderText = () => {
    if (typeof showText === 'function') {
      return showText(color);
    }
    if (showText) {
      return genColorString();
    }
  };

  return (
    <div
      ref={ref}
      className={classNames(colorTriggerPrefixCls, className, {
        [`${colorTriggerPrefixCls}-active`]: open,
        [`${colorTriggerPrefixCls}-disabled`]: disabled,
      })}
      {...pickAttrs(rest)}
    >
      {containerNode}
      {showText && <div className={`${colorTriggerPrefixCls}-text`}>{renderText()}</div>}
    </div>
  );
});

export default ColorTrigger;
