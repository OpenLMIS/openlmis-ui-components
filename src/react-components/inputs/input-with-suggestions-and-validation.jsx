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

import React, { useState, useEffect, useRef } from 'react';

const InputWithSuggestionsAndValidation = ({
  data,
  onClick,
  displayValue,
  placeholder,
  isInvalid,
  valueId,
  displayInformation,
  disabled,
  defaultValue,
  ...props
}) => {
  const getValueToDisplay = (valueId) => {
    if (valueId === null) {
      return '';
    }
    const elementWithId = data.find((element) => element.value === valueId);
    return elementWithId ? elementWithId[displayValue] : '';
  };

  const [touched, setTouched] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTouched(false);
  }, [data]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inputRef]);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setTouched(false);
    }
  };

  useEffect(() => {
    setInputValue(getValueToDisplay(valueId));

    if (valueId === null) {
      setSelectedValue(null);
    }
  }, [valueId]);

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue.name);
      onClick(defaultValue.value);
    }
  }, [defaultValue]);

  const handleClearSelectedValue = () => {
    onClick(null);
    setSelectedValue(null);
    setInputValue('');
    if (touched) {
      setTouched(false);
    }
  };

  const onChange = (value) => {
    if (selectedValue !== null) {
      setSelectedValue(null);
    }

    onClick(null);
    setInputValue(value.target.value);
  };

  const onSelect = (value) => {
    if(value.level) {
      setInputValue(value.name);
      setSelectedValue(value);
      onClick(value);
      setTouched(false);
    } else {
      setInputValue(value.name);
      setSelectedValue(value.value);
      onClick(value.value);
      setTouched(false);
    }
  };

  const resultsToShow = data.map((result) => {
    return (
      <button
        className={`field-full-width suggestions-result ${
          inputValue === result.name ? 'selected-value' : ''
        } ${result.level === 1 ? 'first-level' : ''} ${
          result.level === 2 ? 'second-level' : ''
        } ${result.level === 3 ? 'third-level' : ''}`}
        key={result.value}
        onClick={() => onSelect(result)}
      >
        {result[displayValue]}
      </button>
    );
  });

  return (
    <div ref={inputRef}>
      <div className={`suggestions-input ${isInvalid ? 'is-invalid' : ''}`}>
        <input
          {...props}
          type="text"
          onChange={onChange}
          value={inputValue}
          onFocus={() => {
            setTouched(true);
          }}
          placeholder={placeholder || 'Select an Option'}
          className={`${touched ? 'selected' : 'not-selected'} ${
            disabled ? 'disabled' : ''
          }`}
          disabled={disabled ?? false}
        />
        {inputValue && (
          <button onClick={handleClearSelectedValue}>
            <i className="fa fa-times clear-icon" />
          </button>
        )}
      </div>
      {touched && <div className="suggestions-results">{resultsToShow}</div>}
      {isInvalid && displayInformation && (
        <p className="input-invalid">This field is required</p>
      )}
    </div>
  );
};

export default InputWithSuggestionsAndValidation;
