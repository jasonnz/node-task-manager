const calculateTip = (total, tipP = .25) => total + (total * tipP)

module.exports = { calculateTip }