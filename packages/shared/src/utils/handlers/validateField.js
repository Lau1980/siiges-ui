const validNumber = /^-?\d*\.?\d+$/;

export default function validateField(form, fieldName, setError, validationRules) {
  const error = {};
  const { message, isNumber, isDate } = validationRules[fieldName];
  const value = form[fieldName];

  if (value === undefined || value === '') {
    error[fieldName] = message;
  } else if (isNumber && !validNumber.test(value)) {
    error[fieldName] = message;
  } else if (isDate && Number.isNaN(Date.parse(value))) {
    error[fieldName] = message;
  } else {
    error[fieldName] = '';
  }

  setError((prevErrors) => ({ ...prevErrors, ...error }));

  return error;
}
