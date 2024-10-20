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
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React from 'react';

const NumericInput = ({
    onChange,
    numeric,
    allowNegative = false,
    isInvalid,
    errorMessage,
    ...props
}) => {

    const inputProps = numeric ? {
        className: 'number',
        ...props,
        disabled: props.disabled,
        inputMode: 'numeric',
        pattern: '[0-9]*'
    } : props;

    const parseNumber = stringValue => {
        const n = Number(stringValue);

        if (Number.isNaN(n) || !Number.isSafeInteger(n)) {
            return null;
        }

        return n;
    };

    const handleChange = (event) => {
        const { value } = event.target;

        if (value === '') {
            onChange(null);
            return;
        }

        const positiveNumberRegex = '^\\d+$';
        const negativeNumberRegex = '^\\-?\d*$';

        const numberRegex = allowNegative ? negativeNumberRegex : positiveNumberRegex;

        const match = value.match(numberRegex);

        if (match !== null) {
            const parsedNumber = parseNumber(value);

            if (parsedNumber !== null) {
                onChange(parsedNumber);
            }
        }
    };

    return (
        <input
            className='number'
            type='text'
            onChange={handleChange}
            {...inputProps}
        />
    );
};

export default NumericInput;
