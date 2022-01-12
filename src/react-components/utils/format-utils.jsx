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

//TODO: Use localeService to get the correct format
export const formatDate = (date) => {
    if (!date) {
        return '';
    }

    return moment(date).format('DD/MM/YYYY');
};

export const formatProductName = (orderable) => {
    if (!orderable || !orderable.fullProductName) {
        return '';
    }

    if (orderable.dispensable && orderable.dispensable.displayUnit) {
        return `${orderable.fullProductName} - ${orderable.dispensable.displayUnit}`;
    }

    return orderable.fullProductName;
};

export const formatLot = (lot) => {
    if (!lot || !lot.lotCode) {
        return '';
    }

    if (lot && lot.expirationDate) {
        return `${lot.lotCode} / ${formatDate(lot.expirationDate)}`;
    }

    return lot.lotCode;
};
