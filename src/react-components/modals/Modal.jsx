import React, { useEffect } from 'react';

const Modal = ({ isOpen, children, alertModal = false, sourceOfFundStyle = '' }) => {
    const showHideClassName = isOpen ? 'react-modal display-block' : 'react-modal display-none';
    const alertModalClassName = alertModal ? 'alert-modal is-error' : '';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <>
            {
                isOpen &&
                (
                    <div className={`${showHideClassName} ${alertModalClassName}`}>
                        <section className={`modal-main ${sourceOfFundStyle ? 'source-of-fund-modal' : ''}`}>
                            {children}
                        </section>
                    </div>
                )
            }
        </>

    );
}

export default Modal;
