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

const WebTooltip = ({ shouldDisplayTooltip, tooltipContent, children }) => {
    const TOOLTIP_SHOW_DELAY_MS = 400;
    const TOOLTIP_HIDE_DELAY_MS = 1000;
    const [showTooltip, setShowTooltip] = useState(false);
    const showTooltipTimer = useRef(null);
    const hideTooltipTimer = useRef(null);

    const handleTooltipVisibility = (shouldShow) => {
        clearTimeout(showTooltipTimer.current);
        clearTimeout(hideTooltipTimer.current);

        if (shouldShow) {
            showTooltipTimer.current = setTimeout(() => {
                setShowTooltip(true);
            }, TOOLTIP_SHOW_DELAY_MS);
        } else {
            hideTooltipTimer.current = setTimeout(() => {
                setShowTooltip(false);
            }, TOOLTIP_HIDE_DELAY_MS);
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(showTooltipTimer.current);
            clearTimeout(hideTooltipTimer.current);
        };
    }, []);

    return (
      <div
        className='tooltip-container'
        onMouseEnter={() => shouldDisplayTooltip && handleTooltipVisibility(true)}
        onMouseLeave={() => shouldDisplayTooltip && handleTooltipVisibility(false)}
      >
        {children}
        {shouldDisplayTooltip && tooltipContent && (
          <div className={`tooltip ${showTooltip ? "show" : ""}`}>
            <span
              className='close-tooltip'
              onClick={() => {
                clearTimeout(showTooltipTimer.current);
                clearTimeout(hideTooltipTimer.current);
                setShowTooltip(false);
              }}
            >
              ×
            </span>
            {tooltipContent}
          </div>
        )}
      </div>
    );
};

export default WebTooltip;
