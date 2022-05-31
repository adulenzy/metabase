import React, { memo, useCallback, useMemo } from "react";
import { t } from "ttag";
import { omit, set } from "lodash";
import { color } from "metabase/lib/colors";
import { useCurrentRef } from "metabase/hooks/use-current-ref";
import ColorPicker from "metabase/core/components/ColorPicker";
import { getBrandColorOptions } from "./utils";
import { ColorOption } from "./types";
import {
  TableBody,
  TableBodyCell,
  TableBodyRow,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
} from "./BrandColorSettings.styled";

export interface BrandColorSettingsProps {
  colors: Record<string, string>;
  colorFamily: Record<string, string>;
  onChange?: (colors: Record<string, string>) => void;
}

const BrandColorSettings = ({
  colors,
  colorFamily,
  onChange,
}: BrandColorSettingsProps): JSX.Element => {
  const colorsRef = useCurrentRef(colors);
  const options = useMemo(getBrandColorOptions, []);

  const handleChange = useCallback(
    (colorName: string, color?: string) => {
      if (color) {
        onChange?.(set({ ...colorsRef.current }, colorName, color));
      } else {
        onChange?.(omit({ ...colorsRef.current }, colorName));
      }
    },
    [colorsRef, onChange],
  );

  return (
    <BrandColorTable
      colors={colors}
      colorFamily={colorFamily}
      options={options}
      onChange={handleChange}
    />
  );
};

interface BrandColorTableProps {
  colors: Record<string, string>;
  colorFamily: Record<string, string>;
  options: ColorOption[];
  onChange: (colorName: string, color?: string) => void;
}

const BrandColorTable = ({
  colors,
  colorFamily,
  options,
  onChange,
}: BrandColorTableProps): JSX.Element => {
  return (
    <div>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>{t`Color`}</TableHeaderCell>
          <TableHeaderCell>{t`Where it's used`}</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {options.map(option => (
          <BrandColorRow
            key={option.name}
            color={colors[option.name]}
            originalColor={color(option.name, colorFamily)}
            option={option}
            onChange={onChange}
          />
        ))}
      </TableBody>
    </div>
  );
};

interface BrandColorRowProps {
  color?: string;
  originalColor: string;
  option: ColorOption;
  onChange: (colorName: string, color?: string) => void;
}

const BrandColorRow = memo(function BrandColorRow({
  color,
  originalColor,
  option,
  onChange,
}: BrandColorRowProps) {
  const handleChange = useCallback(
    (color?: string) => {
      onChange(option.name, color);
    },
    [option, onChange],
  );

  return (
    <TableBodyRow>
      <TableBodyCell>
        <ColorPicker
          value={color ?? originalColor}
          isAuto={color == null}
          onChange={handleChange}
        />
      </TableBodyCell>
      <TableBodyCell>{option.description}</TableBodyCell>
    </TableBodyRow>
  );
});

export default BrandColorSettings;