import React from 'react';

const ConfirmModalBody = ({ 
    onConfirm,
    confirmMessage,
    onCancel,
    confirmButtonText = "Confirm",
    confirmButtonStyle = "primary"
}) => (
        <div className='page-container'>
            <div className='page-content element-create-form'>
                <div className='section'>
                    {confirmMessage}
                </div>
            </div>
            <div className='bottom-bar'>
                <div>
                    <button
                        type='button'
                        className='secondary'
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <span>Cancel</span>
                    </button>
                </div>
                <div>
                    <button
                        className={confirmButtonStyle}
                        type='button'
                        onClick={() => onConfirm()}
                    >
                    {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );

export default ConfirmModalBody;