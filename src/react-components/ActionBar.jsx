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
import ResponsiveButton from '../react-components/buttons/responsive-button';
import ButtonWithValidation from './buttons/button-with-validation';

// Action bar component to handle form functionalities
const ActionBar = ({
  onSaveAction,
  onAuthorizeAction,
  onCancelAction,
  onSubmitAction,
  onSubmitAndAuthorizeAction,
  onApproveAction,
  onRejectAction,
  onFinalApproveAction,
  openSourceOfFund,
  typeOfActionText = 'Add',
  totalCost,
  currency,
  submitButton = false,
  authorizeButton = false,
  submitAndAuthorizeButton = false,
  saveButton = false,
  approveButton = false,
  rejectButton = false,
  viewRejectionReasonsButton = false,
  onViewReasonsAction,
  isSourceOfFundInvalid,
  finalApproveButton = false,
  cancelButton = true,
  totalCostInformation = true,
  sourceOfFundButton = true,
}) => {
  return (
    <div className="action-bar-container">
      <div className="left-section">
        {finalApproveButton && (
          <ResponsiveButton
            className="proceed"
            onClick={() => onFinalApproveAction()}
          >
            {' '}
            Final Approval
          </ResponsiveButton>
        )}
        {approveButton && (
          <ResponsiveButton
            className="proceed"
            onClick={() => onApproveAction()}
          >
            {' '}
            Approve
          </ResponsiveButton>
        )}
        {rejectButton && (
          <ResponsiveButton className="danger" onClick={() => onRejectAction()}>
            {' '}
            Reject
          </ResponsiveButton>
        )}
        {saveButton && (
          <ResponsiveButton className="proceed" onClick={() => onSaveAction()}>
            {' '}
            Save
          </ResponsiveButton>
        )}
        {submitAndAuthorizeButton && (
          <ResponsiveButton
            className="proceed"
            onClick={() => onSubmitAndAuthorizeAction()}
          >
            {' '}
            Submit & Authorize
          </ResponsiveButton>
        )}
        {submitButton && (
          <ResponsiveButton
            className="proceed"
            onClick={() => onSubmitAction()}
          >
            {' '}
            Submit
          </ResponsiveButton>
        )}
        {authorizeButton && (
          <ResponsiveButton
            className="proceed"
            onClick={() => onAuthorizeAction()}
          >
            {' '}
            Authorize
          </ResponsiveButton>
        )}
        {cancelButton && (
          <ResponsiveButton onClick={() => onCancelAction()}>
            {' '}
            Cancel
          </ResponsiveButton>
        )}
        {viewRejectionReasonsButton && (
          <ResponsiveButton onClick={() => onViewReasonsAction()}>
            {' '}
            View reasons for rejection
          </ResponsiveButton>
        )}
      </div>
      {totalCostInformation && (
        <p className="total-cost">
          Total Cost: {totalCost} {currency}
        </p>
      )}
      {sourceOfFundButton && (
        <div>
          <ButtonWithValidation
            text={`${typeOfActionText} Source of Fund`}
            className="proceed"
            onClick={() => openSourceOfFund()}
            invalid={isSourceOfFundInvalid}
          />
        </div>
      )}
    </div>
  );
};

export default ActionBar;
