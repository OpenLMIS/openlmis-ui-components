import React from 'react';

/*
    config is an object with the following structure:
    {
        data: Array[] {
            header: string,
            isActive: boolean,
            key: string
        }
        onTabChange: function - function which runs after tab change,
        isTabValidArray?: Array[] - optional array of booleans which represents if the tab is valid,
            if corresponding tab is invalid red mark will be shown
    }
*/

const TabNavigation = ({ config }) => {
  const getClassName = (isActive, index) => {
    let className = '';
    if (config.isTabValidArray && !config.isTabValidArray[index]) {
      className += 'tab-invalid';
    }

    return isActive ? `${className} active` : className;
  };

  return (
    <ul className='nav nav-tabs'>
      {config.data.map((item, index) => {
        return (
          <li key={item.key} className={getClassName(item.isActive, index)}>
            <a
              role='tab'
              data-toggle='tab'
              onClick={() => config.onTabChange(index)}
              className='tabs-link'
            >
              {item.header}
              {item.isCreatingStatus && (
                <i
                  className='fa fa-times clear-icon'
                  style={{ marginLeft: '6px', cursor: 'pointer' }}
                  aria-hidden='true'
                  onClick={() => config.onOrderDelete(index)}
                  title={config.formatMessage('requisition.orderCreate.delete')}
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default TabNavigation;
