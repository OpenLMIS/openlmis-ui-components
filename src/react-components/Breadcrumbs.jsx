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

import React from 'react';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const Breadcrumbs = ({ breadcrumbs }) => {
  const filteredNationalApproveDistrictKeys = breadcrumbs
    .filter((item) => item.match.path === '/buq/national-approve/:districtId')
    .map((item) => item.key);

  const filteredNationalApproveFacilityKeys = breadcrumbs
    .filter(
      (item) =>
        item.match.path === '/buq/national-approve/:districtId/:facilityId'
    )
    .map((item) => item.key);

  const linkBreadcrumbs = [
    '/',
    '/buq/create',
    '/buq/approve',
    '/buq/national-approve',
    filteredNationalApproveDistrictKeys[0],
    filteredNationalApproveFacilityKeys[0],
  ];

  return (
    <ol className="breadcrumb">
      {breadcrumbs.map(({ breadcrumb }, index) => (
        <li key={breadcrumb.key}>
          {linkBreadcrumbs.includes(breadcrumb.key) &&
          index + 1 !== breadcrumbs.length ? (
            <Link to={breadcrumb.key}>
              <span>{breadcrumb}</span>
            </Link>
          ) : (
            <span>{breadcrumb}</span>
          )}
        </li>
      ))}
    </ol>
  );
};

const BreadcrumbsMain = ({ routes }) => {
  const BreadcrumbsWrapper = withBreadcrumbs(routes)(Breadcrumbs);
  return <BreadcrumbsWrapper />;
};

export default BreadcrumbsMain;
