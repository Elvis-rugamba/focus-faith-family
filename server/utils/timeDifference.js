module.exports = (timestamp) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const current = new Date();

  const elapsed = current - timestamp;

  if (elapsed < msPerMinute) {
    return Math.floor(elapsed / 1000) + " secs ago";
  } else if (elapsed < msPerHour) {
    return Math.floor(elapsed / msPerMinute) + " mins ago";
  } else if (elapsed < msPerDay) {
    return Math.floor(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.floor(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.floor(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.floor(elapsed / msPerYear) + " years ago";
  }
}
