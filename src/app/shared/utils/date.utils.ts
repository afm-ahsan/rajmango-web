import * as moment from 'moment';

/**
 * Project-wide helpers for date-only business fields sent to the API.
 *
 * Background: NSwag-generated proxy commands have `startDate/endDate: moment.Moment`
 * and their toJSON() calls `.toISOString()` to serialize. Using plain `moment(dateString)`
 * creates a LOCAL-time moment, so `.toISOString()` converts to UTC and shifts the date
 * (e.g. in Bangladesh UTC+6, "2026-06-01" becomes "2026-05-31T18:00:00.000Z").
 * Using `moment.utc(dateString)` creates a UTC-midnight moment so `.toISOString()`
 * correctly emits "2026-06-01T00:00:00.000Z".
 */
export class DateUtils {
  /**
   * Convert a YYYY-MM-DD string to a UTC moment at midnight.
   * Use for proxy command fields typed as `moment.Moment` (startDate, endDate, etc.)
   * so that toISOString() serializes as "2026-06-01T00:00:00.000Z", not the shifted local time.
   */
  static toUtcMoment(dateString: string | null | undefined): moment.Moment | undefined {
    if (!dateString) return undefined;
    return moment.utc(dateString, 'YYYY-MM-DD', true);
  }
}
