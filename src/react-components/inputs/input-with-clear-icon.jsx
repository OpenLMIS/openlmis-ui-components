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

import React, { useState } from 'react';

const InputWithClearIcon = ({ numeric, ...props }) => {
    
    const [value, setValue] = useState('');
    const string = 'string';

    const inputProps = numeric ? {
        className: 'number',
        ...props,
        inputMode: 'numeric',
        pattern: '[0-9]*'
    } : props;

    const parseNumberValue = (val) => {
        if (!val || (typeof val !== string)) {
            return val;
        }

        if (isNaN(val)) {
            return val;
        }

        return parseInt(val);
    };

    const handleChange = (event) => {
        const { newValue } = event.target.value;
        const parsedValue = numeric ? parseNumberValue(newValue) : newValue;
        
        setValue(parsedValue);
    };

    return (
        <div className='input-with-clear-icon'>
            <input
                type='text'
                {...inputProps}
                onChange={handleChange}
                value={value}
            />
            <button type='button'>
                <i 
                className='fa fa-times clear-icon clear'
                onClick={() => setValue('')}
                />
            </button>
        </div>
    );
};

export default InputWithClearIcon;