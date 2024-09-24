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

import React, { useState } from 'react';
import Table from './table';

const EditableTable = ({ columns, data, updateData, usePagination, displayPagination, pageSize, ...props }) => {

    const [skipPageReset, setSkipPageReset] = useState(false);

    const updateTableData = (rowIndex, columnId, value) => {
        setSkipPageReset(true);

        const newData = _.map(data, ((row, index) => {
            if (index === rowIndex) {
                return {
                    ...row,
                    [columnId]: value
                };
            }
            return row;
        }));

        updateData(newData);
    };

    const deleteRow = (rowIndex) => {
        setSkipPageReset(true);

        const newData = _.filter(data, ((row, index) => (rowIndex !== index)));

        updateData(newData);
    };

    return (
        <Table
            {...props}
            columns={columns}
            data={data}
            skipPageReset={skipPageReset}
            updateTableData={updateTableData}
            displayPagination={displayPagination}
            pageSize={pageSize}
            deleteRow={deleteRow}
        />);
};

export default EditableTable;
