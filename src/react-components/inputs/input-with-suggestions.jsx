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

import React, { useState, useEffect } from 'react';
import Input from './input';


const InputWithSuggestions = ({ data, onClick, sortFunction, displayValue, ...props }) => {

    const [touched, setTouched] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        setInputValue('');
        setTouched(false);
    }, [data]);

    const filterValues = (values, filterValue) => {
        return values.filter((element) => { return element.name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1; });
    }

    const filterAndSortValues = (values, filterValue, sortFunction) => {
        return filterValues(values, filterValue).sort(sortFunction);
    }

    const onChange = (value) => {
        setInputValue(value);
        const dataToSet = sortFunction ? filterValues(data, value) : filterAndSortValues(data, value, sortFunction);
        setResults(dataToSet);
    }

    const onSelect = (value) => {
        onClick(value);
        setInputValue(value[displayValue]);
        setTouched(false);
    }

    const resultsToShow = results.map((result) => {
        return (
            <button 
                className='field-full-width' 
                style={{background: 'transparent', border: '1px solid lightgray', textAlign: 'left', height: '50px'}} 
                key={result.id} 
                onClick={() => onSelect(result)}
            >
                { result[displayValue] }
            </button>
        );
    });

    return (
    <>
    <Input
        {...props}
        onChange={onChange}
        value={inputValue}
        onFocus={() => {setTouched(true)}}
    />
    <div>
        { touched && resultsToShow }
    </div>
    </>
    );
};

export default InputWithSuggestions;
