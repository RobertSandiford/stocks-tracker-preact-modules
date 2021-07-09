// Luxon DateTimes
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })

export { Luxon, LuxonSettings, stDateFormat }