import type { DailyForecast } from "./types"

type PicnicSuitability = "good" | "fair" | "poor" | "unknown"

/**
 * Determines the picnic suitability based on weather conditions
 */
export function getPicnicSuitability(forecast: DailyForecast): PicnicSuitability {
  const { temperature_2m_max, precipitation_probability_max, windspeed_10m_max, uv_index_max } = forecast

  // Poor conditions
  if (
    precipitation_probability_max > 50 || // High chance of rain
    temperature_2m_max < 10 || // Too cold
    temperature_2m_max > 35 || // Too hot
    windspeed_10m_max > 30 // Too windy
  ) {
    return "poor"
  }

  // Fair conditions
  if (
    precipitation_probability_max > 20 || // Some chance of rain
    temperature_2m_max < 15 || // Bit chilly
    temperature_2m_max > 30 || // Bit hot
    windspeed_10m_max > 20 || // Somewhat windy
    uv_index_max > 8 // High UV
  ) {
    return "fair"
  }

  // Good conditions
  return "good"
}

/**
 * Provides picnic advice based on weather conditions
 */
export function getPicnicAdvice(forecast: DailyForecast): string {
  const { temperature_2m_max, precipitation_probability_max, windspeed_10m_max, uv_index_max } = forecast

  const suitability = getPicnicSuitability(forecast)

  if (suitability === "poor") {
    if (precipitation_probability_max > 50) {
      return "High chance of rain. Consider rescheduling your picnic."
    }
    if (temperature_2m_max < 10) {
      return "It's going to be quite cold. Better to plan an indoor activity."
    }
    if (temperature_2m_max > 35) {
      return "Extreme heat expected. If you must go, bring plenty of water and seek shade."
    }
    if (windspeed_10m_max > 30) {
      return "Very windy conditions. Not ideal for a picnic."
    }
    return "Weather conditions are not favorable for a picnic."
  }

  if (suitability === "fair") {
    let advice = "Conditions are acceptable but not ideal. "

    if (precipitation_probability_max > 20) {
      advice += "There's a slight chance of rain, so bring an umbrella. "
    }
    if (temperature_2m_max < 15) {
      advice += "It will be a bit cool, so bring warm clothes. "
    }
    if (temperature_2m_max > 30) {
      advice += "It will be quite warm, so bring plenty of water and sunscreen. "
    }
    if (windspeed_10m_max > 20) {
      advice += "Expect some wind, secure lightweight items. "
    }
    if (uv_index_max > 8) {
      advice += "UV index is high, wear sunscreen and bring shade. "
    }

    return advice
  }

  // Good conditions
  let advice = "Perfect picnic weather! "

  if (uv_index_max > 5) {
    advice += "Don't forget sunscreen. "
  }

  return advice
}
