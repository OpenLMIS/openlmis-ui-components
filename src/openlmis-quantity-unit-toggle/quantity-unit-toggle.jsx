import React, { useCallback, useMemo } from 'react';
import getService from '../react-components/utils/angular-utils';

export default function QuantityUnitToggle({ selectedUnit, onUnitChange }) {
  const { formatMessage } = useMemo(() => getService('messageService'), []);
  const QUANTITY_UNIT = useMemo(() => getService('QUANTITY_UNIT'), []);
  const featureFlagService = useMemo(
    () => getService('featureFlagService'),
    []
  );
  const QUANTITY_UNIT_OPTION_FEATURE_FLAG = useMemo(
    () => getService('QUANTITY_UNIT_OPTION_FEATURE_FLAG'),
    []
  );
  const quantityUnits = useMemo(
    () => [QUANTITY_UNIT.PACKS, QUANTITY_UNIT.DOSES],
    [QUANTITY_UNIT]
  );

  const isVisible = useMemo(() => {
    if (featureFlagService && QUANTITY_UNIT_OPTION_FEATURE_FLAG) {
      const quantityUnitOption = featureFlagService.get(
        QUANTITY_UNIT_OPTION_FEATURE_FLAG
      );
      return quantityUnitOption === QUANTITY_UNIT.BOTH;
    }

    return false;
  }, [
    featureFlagService,
    QUANTITY_UNIT_OPTION_FEATURE_FLAG,
    QUANTITY_UNIT.BOTH,
  ]);

  const handleQuantityUnitChange = useCallback(
    (event) => {
      const newQuantityUnit = event.target.value;
      if (onUnitChange) {
        onUnitChange(newQuantityUnit);
      }
    },
    [onUnitChange]
  );

  const getQuantityUnitMessage = useCallback(
    (unit) => {
      return formatMessage(QUANTITY_UNIT.$getDisplayName(unit));
    },
    [formatMessage, QUANTITY_UNIT]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className='button-toggle'>
      {quantityUnits.map((unit) => (
        <label key={unit} className={selectedUnit === unit ? 'selected' : ''}>
          <input
            type='radio'
            name='quantity-unit'
            value={unit}
            checked={selectedUnit === unit}
            onChange={handleQuantityUnitChange}
          />
          {getQuantityUnitMessage(unit)}
        </label>
      ))}
    </div>
  );
}
