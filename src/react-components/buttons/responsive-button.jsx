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

const ButtonIcon = ({ children, icon, alwaysShowText, textOnLeft }) => {
    if (!icon) {
        return null;
    }

    return (
        <i className={`fa fa-${icon} ${children ? `has-text${textOnLeft ? '-left' : ''}` : ''} ${alwaysShowText ? `show-text${textOnLeft ? '-left' : ''}` : ''}`}/>
    )
};

const ButtonText = ({ children, icon, alwaysShowText }) => {
    if (!children) {
        return null;
    }

    return (
        <span className={(!icon || alwaysShowText) ? '' : 'button-text'}>{children}</span>
    )
};

export const ResponsiveButton = ({ children, icon, alwaysShowText, textOnLeft, className, ...props }) => (
    <button type="button" {...props} className={`btn responsive-button ${className ? className : ''}`}>
        {
            textOnLeft ? (
                <span>
                    <ButtonText icon={icon} alwaysShowText={alwaysShowText}>{children}</ButtonText>
                    <ButtonIcon icon={icon} alwaysShowText={alwaysShowText} textOnLeft={textOnLeft}>
                        {children}
                    </ButtonIcon>
                </span>
            ) : (
                <span>
                    <ButtonIcon icon={icon} alwaysShowText={alwaysShowText} textOnLeft={textOnLeft}>
                        {children}
                    </ButtonIcon>
                    <ButtonText icon={icon} alwaysShowText={alwaysShowText}>{children}</ButtonText>
                </span>
            )
        }
    </button>
);

export default ResponsiveButton;
