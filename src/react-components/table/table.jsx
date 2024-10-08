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

import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

import PrevPageButton from '../buttons/prev-page-button';
import NextPageButton from '../buttons/next-page-button';
import PageButton from '../buttons/page-button';

import getService from '../utils/angular-utils';

const Table = ({
    columns,
    data,
    skipPageReset,
    updateTableData,
    deleteRow,
    validateRow,
    showValidationErrors,
    noItemsMessage,
    customReactTableContentStyle,
    customReactTableStyle,
    withScrollStyle = false,
    displayPagination = true,
    additionalTableClass = '',
    pageSize = 10,
    ...props
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        rows,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
            ...props,
            columns,
            data,
            initialState: {
                pageIndex: 0,
                pageSize: pageSize
            },
            autoResetPage: !skipPageReset,
            updateTableData,
            deleteRow,
            validateRow,
            showValidationErrors,
            noItemsMessage
        },
        usePagination
    );

    const { formatMessage } = useMemo(() => getService('messageService'), []);

    const ref = useRef(null);
    // Get width of the table and pass it to the table-empty-message
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        setWidth(ref.current.offsetWidth);
    }, []);

    const validatePage = (pageNumber) => {
        if (!validateRow || !showValidationErrors) {
            return true;
        }

        const startInd = pageNumber * pageSize;
        let endInd = (pageNumber + 1) * pageSize;
        endInd = endInd < rows.length ? endInd : rows.length;
        let i, valid = true;

        for (i = startInd; i < endInd; i++) {
            valid = validateRow(rows[i].original);

            if (!valid) {
                return false;
            }
        }

        return valid;
    };

    const getPages = () => {
        const pageNumbers = [];
        let i, valid;

        for (i = 3; i >= 0; i--) {
            if (pageIndex - i >= 0) {
                valid = validatePage(pageIndex - i);
                pageNumbers.push({ number: pageIndex - i, invalid: !valid });
            }
        }

        for (i = 1; i <= 3; i++) {
            if (pageIndex + i < pageCount) {
                valid = validatePage(pageIndex + i);
                pageNumbers.push({ number: pageIndex + i, invalid: !valid });
            }
        }

        return pageNumbers;
    };

    return (
        <div className={`${additionalTableClass} react-table-container${withScrollStyle ? '-scroll' : ''}`}>
            <div className={`react-table-content${withScrollStyle ? '-scroll' : ''} ${customReactTableContentStyle ? customReactTableContentStyle : ''}`}>
                <table {...getTableProps()} className={`react-table ${customReactTableStyle ? customReactTableStyle : ''}`} ref={ref}>
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
                    {page.map((row) => {
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
                        <span>{!noItemsMessage ? formatMessage('react.table.noItems') : noItemsMessage}</span>
                    </div>
                ) : null}
            </div>
            <div className="pagination-responsive">
                {
                    (rows.length > 0 && displayPagination) ? (
                        <>
                            <span>Showing {page.length} item(s) out of {rows.length} total</span>
                            <div className="btn-group">
                                <PrevPageButton onClick={() => previousPage()} disabled={!canPreviousPage} />
                                {
                                    getPages().map(page => (
                                        <PageButton
                                            key={`page-${page.number}`}
                                            active={page.number === pageIndex}
                                            invalid={page.invalid}
                                            onClick={() => gotoPage(page.number)}
                                        >{page.number + 1}
                                        </PageButton>
                                    ))
                                }
                                <NextPageButton onClick={() => nextPage()} disabled={!canNextPage} />
                            </div>
                        </>
                    ) : null
                }
            </div>
        </div>
    );
};

export default Table;
