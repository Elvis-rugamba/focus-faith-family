const { translate } = require("../i18n/i18n");
module.exports = (timestamp, currentLocale) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const current = new Date();

  const elapsed = current - timestamp;

  if (elapsed < msPerMinute) {
    return Math.floor(elapsed / 1000) + translate('secsLabel', currentLocale);
  } else if (elapsed < msPerHour) {
    return Math.floor(elapsed / msPerMinute) +  " " + translate('minsLabel', currentLocale);
  } else if (elapsed < msPerDay) {
    return Math.floor(elapsed / msPerHour) + " " + translate('hoursLabel', currentLocale);
  } else if (elapsed < msPerMonth) {
    return Math.floor(elapsed / msPerDay) + " " + translate('daysLabel', currentLocale);
  } else if (elapsed < msPerYear) {
    return Math.floor(elapsed / msPerMonth) + " " + translate('monthsLabel', currentLocale);
  } else {
    return Math.floor(elapsed / msPerYear) + " " + translate('yearsLabel', currentLocale);
  }
}
