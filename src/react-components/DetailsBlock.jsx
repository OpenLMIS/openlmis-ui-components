/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Fundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React from 'react';

// Details block component to print out data
const DetailsBlock = ({ data, className }) => {
    return (
        <div className={`details-block-container ${className ? className : ''}`}>
            <table>
                <tbody>
                    {data.map((elements, index) => (
                        <tr key={elements + index}>
                            {elements.map((element) => (
                                <td key={element.topic} className='element'>
                                    {element.topic}: <b>{element.value}</b>
                                </td>
                            ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DetailsBlock;
