const { DateTime : Luxon , Settings : LuxonSettings } = require('luxon')

// Luxon DateTimes
LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { });

module.exports = {
    Luxon,
    LuxonSettings,
    stDateFormat
}