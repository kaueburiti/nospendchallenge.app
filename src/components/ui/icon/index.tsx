'use client';
import React, { useMemo } from 'react';
import { createIcon } from '@gluestack-ui/icon';
import { Svg } from 'react-native-svg';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { type VariantProps } from '@gluestack-ui/nativewind-utils';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import {useTheme} from "@/hooks/useTheme";

type IPrimitiveIcon = {
  height?: number | string;
  width?: number | string;
  fill?: string;
  color?: string;
  size?: number | string;
  stroke?: string;
  as?: React.ElementType;
  className?: string;
};

const PrimitiveIcon = React.forwardRef<
  React.ElementRef<typeof Svg>,
  IPrimitiveIcon
>(
  (
    {
      height,
      width,
      fill = 'none',
      color,
      size,
      stroke = 'currentColor',
      as: AsComp,
      ...props
    },
    ref,
  ) => {
    const sizeProps = useMemo(() => {
      if (size) return { size };
      if (height && width) return { height, width };
      if (height) return { height };
      if (width) return { width };
      return {};
    }, [size, height, width]);
    const { isDark } = useTheme();
    let colorProps =
      stroke === 'currentColor' && color !== undefined ? color : stroke;

    // quickfix because otherwise it uses default theme color which blue somehow - gluestack bug?
    colorProps = color ?? (isDark ? resolveConfig(tailwindConfig).theme.colors.neutral[100] : resolveConfig(tailwindConfig).theme.colors.neutral[900]);

    if (AsComp) {
      return (
        <AsComp
          ref={ref}
          fill={fill}
          {...props}
          {...sizeProps}
          stroke={colorProps}
        />
      );
    }
    return (
      <Svg
        ref={ref}
        height={height}
        width={width}
        fill={fill}
        stroke={colorProps}
        {...props}
      />
    );
  },
);

export const UIIcon = createIcon({
  Root: PrimitiveIcon,
});

const iconStyle = tva({
  base: 'text-typography-950 fill-none',
  variants: {
    size: {
      '2xs': 'h-3 w-3',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
});

type IIConProps = IPrimitiveIcon &
  VariantProps<typeof iconStyle> &
  React.ComponentPropsWithoutRef<typeof UIIcon>;

export const Icon = React.forwardRef<React.ElementRef<typeof Svg>, IIConProps>(
  ({ size = 'md', className, ...props }, ref) => {
    if (typeof size === 'number') {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
          size={size}
        />
      );
    } else if (
      (props.height !== undefined || props.width !== undefined) &&
      size === undefined
    ) {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
        />
      );
    }
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={iconStyle({ size, class: className })}
      />
    );
  },
);
