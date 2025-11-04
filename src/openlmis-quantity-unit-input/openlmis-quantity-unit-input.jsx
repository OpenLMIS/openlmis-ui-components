import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InputCell from '../react-components/table/input-cell';
import getService from '../react-components/utils/angular-utils';

export default function QuantityUnitInput({
  showInDoses,
  item,
  onChangeQuantity,
  ...inputCellProps
}) {
  const messageService = useMemo(() => getService('messageService'), []);
  const quantityUnitCalculateService = useMemo(
    () => getService('quantityUnitCalculateService'),
    []
  );

  const [localValues, setLocalValues] = useState({
    orderedQuantity: item?.orderedQuantity || '',
    quantityInPacks: item?.quantityInPacks || '',
    quantityRemainderInDoses: item?.quantityRemainderInDoses || '',
  });

  const netContent = useMemo(
    () => item?.orderable?.netContent || 1,
    [item?.orderable?.netContent]
  );

  const isQuantityRemainderInDosesDisabled = useCallback(() => {
    return netContent === 1;
  }, [netContent]);

  // Sync local state when item props change
  useEffect(() => {
    setLocalValues({
      orderedQuantity: item?.orderedQuantity ?? '',
      quantityInPacks: item?.quantityInPacks ?? '',
      quantityRemainderInDoses: item?.quantityRemainderInDoses ?? '',
    });
  }, [
    item?.orderedQuantity,
    item?.quantityInPacks,
    item?.quantityRemainderInDoses,
  ]);

  const handleLocalChange = useCallback((field, value) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback(() => {
    const updatedItem = { ...item, ...localValues };

    const recalculatedItem =
      quantityUnitCalculateService.recalculateInputQuantity(
        updatedItem,
        netContent,
        showInDoses,
        'orderedQuantity'
      );

    setTimeout(() => {
      onChangeQuantity(recalculatedItem);
    }, 0);
  }, [
    localValues,
    item,
    netContent,
    showInDoses,
    quantityUnitCalculateService,
    onChangeQuantity, // Now directly depends on onChangeQuantity
  ]);

  const formatMessage = useCallback(
    (key) => {
      return messageService.get(key);
    },
    [messageService]
  );

  useEffect(() => {
    // Recalculate the item if it has orderedQuantity but no quantityRemainderInDoses or quantityInPacks
    // and if we are not showing in doses
    if (
      !showInDoses &&
      item?.orderedQuantity &&
      !item?.quantityRemainderInDoses &&
      !item?.quantityInPacks
    ) {
      const recalculatedItem =
        quantityUnitCalculateService.recalculateInputQuantity(
          item,
          netContent,
          !showInDoses,
          'orderedQuantity'
        );

      onChangeQuantity(recalculatedItem);
    }
  }, [
    item,
    netContent,
    showInDoses,
    onChangeQuantity,
    quantityUnitCalculateService,
  ]);

  if (showInDoses) {
    return (
      <div>
        <InputCell
          {...inputCellProps}
          value={localValues.orderedQuantity}
          onChange={(value) => handleLocalChange('orderedQuantity', value)}
          onBlur={handleBlur}
          key={`orderedQuantity-${item?.orderable?.id}`}
        />
      </div>
    );
  }

  return (
    <div className='openlmis-input'>
      <InputCell
        {...inputCellProps}
        value={localValues.quantityInPacks}
        onChange={(value) => handleLocalChange('quantityInPacks', value)}
        onBlur={handleBlur}
        placeholder={formatMessage('openlmisInputDosesPacks.Packs')}
        id='quantityInPacks'
        key={`quantityInPacks-${item?.orderable?.id}`}
      />
      <p> ( + </p>
      <InputCell
        {...inputCellProps}
        value={localValues.quantityRemainderInDoses}
        onChange={(value) =>
          handleLocalChange('quantityRemainderInDoses', value)
        }
        onBlur={handleBlur}
        disabled={
          inputCellProps.disabled || isQuantityRemainderInDosesDisabled()
        }
        placeholder={formatMessage('openlmisInputDosesPacks.Doses')}
        id='quantityRemainderInDoses'
        key={`quantityRemainderInDoses-${item?.orderable?.id}`}
      />
      <p>{formatMessage('openlmisInputDosesPacks.DosesBracket')}</p>
    </div>
  );
}