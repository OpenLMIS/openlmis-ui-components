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

import React, { useState } from 'react';

const parseNumber = (stringValue, allowNegative) => {
    if (stringValue === '' || stringValue === '-') {
        return null;
    }

    const n = Number(stringValue)

    if (Number.isNaN(n) || !Number.isSafeInteger(n)) {
        return null;
    }

    if (!allowNegative && n < 0) {
        return null
    }

    return n;
}

const NumericInput = ({
                          onChange,
                          className = 'number',
                          initialValue = '0',
                          onBlur = null,
                          allowNegative = false
                      }) => {

    const [value, setValue] = useState(initialValue);

    const handleOnChange = (value, allowNegative) => {
        const number = parseNumber(value, allowNegative);

        setValue(
            value === '' || value === '-'
                ? value
                : parseInt(value).toString()
        );

        onChange(number);
    };

    return (
        <input
            className={className}
            onBlur={ev => onBlur ? onBlur(ev) : null}
            onChange={ev => handleOnChange(ev.target.value, allowNegative)}
            type={'text'}
            value={value}
        />
    );
};

export default NumericInput;
