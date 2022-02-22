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

import React, { useState, useEffect } from 'react';

import NumericInput from '../inputs/numeric-input';

const InputCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateTableData,
    validateCell,
    numeric = false
}) => {
    const [value, setValue] = useState(initialValue);
    const [valid, setValid] = useState(true);

    const onChange = val => {
        setValue(val);

        if (validateCell) {
            setValid(validateCell(val, id));
        }
    };

    const onBlur = () => {
        updateTableData(index, id, value);

        if (validateCell) {
            setValid(validateCell(value, id));
        }
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <div className={`form-control ${valid ? '' : 'is-invalid'}`}>
            {numeric && <NumericInput initialValue={value} onChange={onChange} onBlur={onBlur}/>}
            {!numeric && <Input value={value} onChange={onChange} onBlur={onBlur}/>}
        </div>
    );
};

export default InputCell;
