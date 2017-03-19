const timelog = () => {
  return '[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ']   ';
}

exports.log = (msg) => {
  console.log(timelog() + msg)
}
