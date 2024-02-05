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

import React, { useRef, useState, useLayoutEffect } from 'react';
import { useTable } from 'react-table';

const TableNoPagination = ({
    columns,
    data,
    noItemsMessage,
    customReactTableContainerStyle,
    customReactTableContentStyle,
    customReactTableStyle,
    ...props
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows
    } = useTable(
        {
            ...props,
            columns,
            data,
            noItemsMessage
        },
    );

    const ref = useRef(null);
    // Get width of the table and pass it to the table-empty-message
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        setWidth(ref.current.offsetWidth);
    }, []);

    return (
        <>
            <div className={`react-table-container ${customReactTableContainerStyle}`}>
                <div className={`react-table-content ${customReactTableContentStyle}`}>
                    <table {...getTableProps()} className={`react-table ${customReactTableStyle}`} ref={ref}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                if (row.original.hasOwnProperty('displayCategory')) {
                                    return (
                                        <tr className='category-row' key={row.original.displayCategory}>
                                            <td colSpan="100%">{row.original.displayCategory}</td>
                                        </tr>
                                    )
                                }

                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {!data.length ? (
                        <div className='table-empty-message' style={{ width: width }}>
                            <span>{!noItemsMessage ? "Showing no items" : noItemsMessage}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default TableNoPagination;
