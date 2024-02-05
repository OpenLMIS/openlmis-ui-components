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

import React, { useMemo, useState } from "react";
import { useTable } from "react-table";

import PrevPageButton from "../buttons/prev-page-button";
import NextPageButton from "../buttons/next-page-button";
import PageButton from "../buttons/page-button";

const TableByCategories = ({
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
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const numberOfAllProducts = data.reduce((prev, curr) => {
    if (curr.displayCategory) {
      return prev;
    }

    return prev + 1;
  }, 0);

  // Creates an array that stores arrays representing each page
  let count = 0;
  const allPages = useMemo(() => {
    return data.reduce((prev, curr) => {
      if (count === 0) {
        count = 10;
        prev.push([curr]);
      } else {
        prev.at(-1).push(curr);
      }

      if (!curr.displayCategory) {
        count--;
      }

      return prev;
    }, []);
  }, [data]);

  const productsOnCurrentPage = allPages[currentPage]?.filter(
    (item) => !item.displayCategory
  );

  const currentPageData = allPages[currentPage] || [];

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      ...props,
      columns,
      data: currentPageData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
      autoResetPage: !skipPageReset,
      updateTableData,
      deleteRow,
      validateRow,
      showValidationErrors,
      noItemsMessage,
    });

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const validatePage = (pageNumber) => {
    if (!validateRow || !showValidationErrors) {
      return true;
    }

    let isValid = true;
    allPages[pageNumber]?.forEach((row) => {
      if (!validateRow(row)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const getPages = () => {
    const pageNumbers = [];
    let i, valid;

    for (i = 3; i >= 0; i--) {
      if (currentPage - i >= 0) {
        valid = validatePage(currentPage - i);
        pageNumbers.push({ number: currentPage - i, invalid: !valid });
      }
    }

    for (i = 1; i <= 3; i++) {
      if (currentPage + i < allPages.length) {
        valid = validatePage(currentPage + i);
        pageNumbers.push({ number: currentPage + i, invalid: !valid });
      }
    }

    return pageNumbers;
  };

  return (
    <div className={`react-table-container${withScrollStyle ? "-scroll" : ""}`}>
      <div
        className={`react-table-content${withScrollStyle ? "-scroll" : ""} ${
          customReactTableContentStyle ? customReactTableContentStyle : ""
        }`}
      >
        <table
          {...getTableProps()}
          className={`react-table ${
            customReactTableStyle ? customReactTableStyle : ""
          }`}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              if (row.original.hasOwnProperty("displayCategory")) {
                return (
                  <tr
                    className="category-row"
                    key={row.original.displayCategory}
                  >
                    <td colSpan="100%">{row.original.displayCategory}</td>
                  </tr>
                );
              }

              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination-responsive">
        {allPages.length > 0 ? (
          <>
            <span>
              Showing {productsOnCurrentPage.length} item(s) out of{" "}
              {numberOfAllProducts} total
            </span>
            <div className="btn-group">
              <PrevPageButton
                onClick={() => {
                  changePage(currentPage - 1);
                }}
                disabled={currentPage === 0}
              />
              {getPages().map((paginationData) => (
                <PageButton
                  key={`page-${paginationData.number}`}
                  active={paginationData.number === currentPage}
                  invalid={paginationData.invalid}
                  onClick={() => changePage(paginationData.number)}
                >
                  {paginationData.number + 1}
                </PageButton>
              ))}
              <NextPageButton
                onClick={() => {
                  changePage(currentPage + 1);
                }}
                disabled={currentPage + 1 === allPages.length}
              />
            </div>
          </>
        ) : (
          <div className="table-empty-message">
            <span>{!noItemsMessage ? "Showing no items" : noItemsMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableByCategories;
