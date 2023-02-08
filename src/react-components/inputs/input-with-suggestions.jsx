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
import Input from '../../react-components/inputs/input';


const InputWithSuggestions = ({ data, onClick, displayValue, placeholder, ...props }) => {

    const filterValues = (values, filterValue) => {
        return filterValue !== '' ? values.filter((element) => { 
            return element.name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1; 
        }) : values;
    };

    const [touched, setTouched] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        setInputValue('');
        setResults(data);
        setTouched(false);
    }, [data]);

    const handleTouched = () => {
        if (!selectedValue) {
            setInputValue('');
            setResults(data);
        }
        setTouched(!touched);
    };

    const onChange = (value) => {
        if (selectedValue !== null ) {
            setSelectedValue(null);
        }
        const dataToSet = filterValues(data, value);
        onClick(null);
        setResults(dataToSet);
        setInputValue(value.value);
    };

    const onSelect = (value) => {
        setInputValue(value.name);
        setSelectedValue(value.value);
        onClick(value.value);
        setTouched(false);
    };

    const resultsToShow = results.map((result) => {
        return (
            <button 
                className='field-full-width' 
                style={{background: 'transparent', border: '1px solid lightgray', textAlign: 'left', height: '50px'}} 
                key={result.value} 
                onClick={() => onSelect(result)}
            >
                { result[displayValue] }
            </button>
        );
    });

    return (
    <>
        <div style={{display: 'flex', gap: '10px', 'alignItems': 'center'}}>
            <Input
                {...props}
                onChange={onChange}
                value={inputValue}
                onFocus={() => {setTouched(true)}}
                placeholder={placeholder || 'Select an Option'}
            />
            {touched && !selectedValue && 
                <button onClick={handleTouched} style={{background: 'transparent', border: 'none'}}>
                    <i className='fa fa-times clear-icon'/>
                </button>
            }
        </div>
        {touched && !selectedValue && 
            <div style={{'maxHeight': '150px', overflow: 'auto'}}>
                { resultsToShow }
            </div>
        }
    </>
    );
};

export default InputWithSuggestions;
