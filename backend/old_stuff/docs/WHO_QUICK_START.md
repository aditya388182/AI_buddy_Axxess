# WHO Data Integration - Quick Reference

## What You get

✅ **Population-level health data** from WHO for 180+ countries  
✅ **13+ pre-configured health indicators** (mortality, disease burden, vaccination)  
✅ **REST API endpoints** to query and filter data  
✅ **Structured training datasets** ready for ML models  
✅ **FHIR-normalized format** for consistency with clinical data  

## Quick Start (5 minutes)

### 1. Initialize with default data
```bash
curl -X POST http://localhost:5000/api/who/fetch
```
This fetches default indicators for major countries (2015-2023).

### 2. Check what you have
```bash
curl http://localhost:5000/api/who/summary
```

### 3. Get data for your AI model
```bash
curl "http://localhost:5000/api/who/training-dataset?category=disease_burden&minYear=2015&maxYear=2023"
```

## Common API Calls

### Query by Country
```bash
curl "http://localhost:5000/api/who/country/India?limit=50"
```

### Compare Disease Across Countries
```bash
curl "http://localhost:5000/api/who/disease-burden/M_004?year=2023"
# Returns infant mortality rates ranked by country
```

### Time Series Trend
```bash
curl "http://localhost:5000/api/who/indicators?country=Brazil&indicatorCode=M_003&yearFrom=2015&yearTo=2023"
# Get crude death rate trend over 8 years
```

### Get Training Data for Specific Category
```bash
curl "http://localhost:5000/api/who/training-dataset?category=mortality&minYear=2010&maxYear=2023"
```

## Data Categories Available

- `disease_burden` - Deaths from specific diseases (TB, malaria, HIV, etc.)
- `mortality` - General/infant/maternal mortality rates
- `vaccination` - Immunization coverage (DTP, measles, etc.)
- `health_coverage` - Life expectancy, health service metrics
- `epidemiology` - Disease prevalence and incidence
- `health_services` - Health system capacity metrics
- `health_workforce` - Doctor/nurse density
- `health_financing` - Healthcare spending per capita
- `environmental_health` - Air quality, water safety, etc.

## Pre-configured Indicators

| Code | Name | Example Use |
|------|------|-------------|
| M_003 | Crude Death Rate | Baseline health profile |
| M_004 | Infant Mortality | Maternal/child health tracking |
| M_008 | Maternal Mortality | Women's health outcomes |
| M_075 | Life Expectancy | Overall population health |
| M_101 | DTP3 Coverage | Vaccination effectiveness |
| UHCER_TB | TB Mortality | Infectious disease burden |
| UHCER_HIV | HIV/AIDS Mortality | Epidemic monitoring |
| UHCER_MALARIA | Malaria Mortality | Tropical disease burden |

## Using with Python for ML

```python
import requests
import pandas as pd
from sklearn.preprocessing import StandardScaler

# 1. Fetch training data
response = requests.get(
  'http://localhost:5000/api/who/training-dataset',
  params={'category': 'disease_burden', 'minYear': 2015, 'maxYear': 2023}
)
dataset = response.json()['data']

# 2. Convert to DataFrame
features = []
for country in dataset['countries']:
  for year in dataset['years']:
    row = dataset['dataset'].get(country, {}).get(year, {})
    if row:
      features.append({
        'country': country,
        'year': year,
        **row
      })
df = pd.DataFrame(features)

# 3. Prepare for ML
X = df.drop(['country', 'year'], axis=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Train your model
from sklearn.ensemble import RandomForestRegressor
model = RandomForestRegressor()
model.fit(X_scaled, y)
```

## Fetch Custom Data

Send specific countries and indicators:

```bash
curl -X POST http://localhost:5000/api/who/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "indicatorCodes": ["M_003", "M_004", "M_008", "UHCER_TB"],
    "countries": ["USA", "India", "Brazil", "Nigeria"],
    "fromYear": 2010,
    "toYear": 2023
  }'
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "indicatorCode": "M_003",
      "indicatorName": "Crude Death Rate",
      "category": "mortality",
      "geography": {
        "country": "United States of America",
        "countryCode": "USA"
      },
      "year": 2023,
      "value": 8.3,
      "unit": "per 1000 population",
      "dataQuality": "high"
    }
  ],
  "count": 45
}
```

## Training Dataset Format

```json
{
  "category": "disease_burden",
  "period": { "from": 2015, "to": 2023 },
  "statistics": {
    "totalCountries": 45,
    "totalYears": 9,
    "totalRecords": 405
  },
  "countries": ["USA", "India", ...],
  "years": [2015, 2016, ..., 2023],
  "dataset": {
    "United States of America": {
      "2023": {
        "UHCER_TB": { "value": 2.8, "unit": "deaths per 100,000" },
        "UHCER_HIV": { "value": 1.5, ... },
        ...
      },
      ...
    }
  }
}
```

## Database

All data stored in `HealthIndicator` collection in MongoDB:
- Indexed by: country, year, category, indicatorCode
- Auto-updated with latest WHO data
- Queryable via REST API

## Limitations & Notes

⚠️ **Data Lag**: Most recent data is 1-2 years old (WHO publication delay)  
⚠️ **Population-Level Only**: No individual patient identifiers  
⚠️ **Estimates**: Some values are WHO statistical estimates  
⚠️ **Coverage Gaps**: Not all countries/indicators have complete data  

## What's Next

1. **Combine with patient data** from EHR/wearables endpoints
2. **Add geolocation** to patient records to match with regional WHO data
3. **Feed into AI model** as contextual features
4. **Track model performance** across different regions/disease burdens
5. **Alert system** for when local disease burden exceeds thresholds

## See Also

- [Full Documentation](./WHO_DATA_INTEGRATION.md)
- [Data Ingestion Module](./docs/ARCHITECTURE.md)
- [FHIR Normalization](./FHIR_NOTES.md)

---

**Ready to use!** Start with: `curl -X POST http://localhost:5000/api/who/fetch`
