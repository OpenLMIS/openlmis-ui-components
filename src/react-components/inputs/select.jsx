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

import React, { useMemo } from 'react';
import getService from '../utils/angular-utils';

const Select = ({ options = [], value, onChange, objectKey, defaultOption='react.select.defaultMessage', isTranslatable = false, ...props }) => {
    const findOption = (val) => _.find(options, (opt) => (_.get(opt.value, objectKey) === val));
    const { formatMessage } = useMemo(() => getService('messageService'), []);

    const handleChange = (event) => {
        const { value } = event.target;

        if (onChange) {
            if (value && objectKey) {
                const option = findOption(value);
                const val = option ? option.value : null;

                onChange(val);
            } else {
                onChange(value);
            }
        }
    };

    let selectValue = value;

    if (objectKey) {
        selectValue = !value ? value : _.get(value, objectKey);
    }

    const getOptionValue = (option) => isTranslatable ? formatMessage(option) : option;

    return (
        <select value={selectValue} onChange={handleChange} {...props}>
            <option value="">{formatMessage(defaultOption)}</option>
            {
                options.map(
                    ({value, name}) => {
                        let optionValue = value;

                        if (objectKey) {
                            optionValue = _.get(value, objectKey);
                        }

                        return (<option key={optionValue} value={optionValue}>{getOptionValue(name)}</option>);
                    }
                )
            }
        </select>
    );
};

export default Select;
