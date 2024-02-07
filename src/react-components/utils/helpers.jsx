// File with all supporting functions

export const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "string" && value.trim().length === 0) ||
    value == undefined
  );
};

export const objectNotEmpty = (object) => Object.keys(object).length;

export const formatDateToMonthDayYear = (inputDate) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
  return formattedDate;
}
