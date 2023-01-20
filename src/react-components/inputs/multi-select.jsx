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

import React, { useState, useRef, useEffect } from 'react';

function useOutsideAlerter(ref, setIsOptionListShown) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOptionListShown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
  
const MultiSelect = ({ options, selected, toggleOption, disabled }) => {
    const SELECT_OPTION_LABEL = "Select an option";
    
    const [isOptionListShown, setIsOptionListShown] = useState(false);

    const handleClickMultiSelect = event => {
      setIsOptionListShown(current => !current);
    };

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setIsOptionListShown);

    return (
        <div
          ref={wrapperRef}
          onClick={handleClickMultiSelect} 
          className="multiselect" 
          style={disabled ? {pointerEvents: "none", opacity: "0.4"} : {}}
        >
            <div className="multiselect-selected">
                <i className="fa fa-sort-desc" aria-hidden="true"></i>
                <div 
                  style={{marginLeft: "5px"}}
                > 
                  {selected.length > 0 ? selected.join(', ') : SELECT_OPTION_LABEL} 
                </div>
            </div>
            {isOptionListShown && <ul className="multiselect-options">
                {options.map(option => {
                    const isSelected = selected.includes(option.id);

                    return (
                        <li className="multiselect-option" onClick={() => toggleOption({ id: option.id })}>
                            <input type="checkbox" checked={isSelected} className="multiselect-option-checkbox"></input>
                            <span>{option.name}</span>
                        </li>
                    )
                })}
            </ul>}
        </div>
    )
}

export default MultiSelect;
