/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

import React, { useState } from "react";
import WebTooltip from "../modals/web-tooltip";

const FIELD_REQUIRED_TOOLTIP = 'This field is required';

const parseNumber = (stringValue) => {
  const n = Number(stringValue);
  if (Number.isNaN(n) || !Number.isFinite(n)) {
    return null;
  }

  return n;
};

const NumericDecimalInput = ({
  onChange,
  className = "number",
  value: initialValue = "",
  onBlur = null,
  allowNegative = false,
  isInvalid,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  const handleOnChange = (value) => {
    if (value === "") {
      setValue(value);
      onChange(null);
      return;
    }

    // Changed ^\\d+$ regex to ^[0-9]*\.?[0-9]{0,2}$ - now can enter e.q. 100.10
    const positiveNumberRegex = "^[0-9]*.?[0-9]{0,2}$";
    const negativeNumberRegex = "^\\-?d*$";

    const numberRegex = allowNegative
      ? negativeNumberRegex
      : positiveNumberRegex;

    const match = value.match(numberRegex);

    if (match !== null) {
      const parsedNumber = parseNumber(value);

      if (parsedNumber !== null) {
        onChange(parsedNumber);
        setValue(value);
      }
    }
  };

  return (
    <WebTooltip shouldDisplayTooltip={isInvalid} tooltipContent={FIELD_REQUIRED_TOOLTIP}>
      <div className={`input-control ${isInvalid ? "is-invalid" : ""} ${props.disabled ? "is-disabled" : ""}`}>
        <input
          className={className}
          onBlur={onBlur}
          onChange={(ev) => handleOnChange(ev.target.value)}
          type={"text"}
          value={value}
          {...props}
        />
      </div>
    </WebTooltip>
  );
};

export default NumericDecimalInput;
