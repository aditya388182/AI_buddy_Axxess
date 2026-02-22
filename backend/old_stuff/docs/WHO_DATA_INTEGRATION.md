# WHO Data Integration for AI Training

This module provides seamless integration with the World Health Organization (WHO) Global Health Observatory (GHO) to fetch, normalize, and store health data for AI model training.

## Overview

The WHO Data Integration service allows you to:
- **Fetch** health indicators from WHO Global Health Observatory API
- **Normalize** data to FHIR format for consistency with your clinical data
- **Store** aggregated population-level health metrics in MongoDB
- **Query** indicators by country, category, time period
- **Generate** structured training datasets for machine learning

This complements your patient-level data (from EHR and wearables) with population-level epidemiological data.

## Architecture

```
WHO GHO API
    ↓
whoDataService (Fetch & Normalize)
    ↓
HealthIndicator Model (MongoDB)
    ↓
whoDataRoutes (REST API)
    ↓
Your AI Training Pipeline
```

## Available Health Indicators

The module comes pre-configured with 13 essential WHO indicators:

| Code | Indicator | Category | Unit |
|------|-----------|----------|------|
| M_003 | Crude Death Rate | Mortality | per 1000 population |
| M_004 | Infant Mortality Rate | Mortality | per 1000 live births |
| M_005 | Under-five Mortality Rate | Mortality | per 1000 live births |
| M_008 | Maternal Mortality Ratio | Mortality | per 100,000 live births |
| M_075 | Life Expectancy at Birth | Health Coverage | years |
| M_101 | DTP3 Immunization Coverage | Vaccination | percentage |
| M_117 | Measles Immunization Coverage | Vaccination | percentage |
| UHCER_DIARRHEA | Diarrheal Disease Mortality | Disease Burden | deaths per 100,000 |
| UHCER_LOWERRESP | Lower Respiratory Infection Mortality | Disease Burden | deaths per 100,000 |
| UHCER_MALARIA | Malaria Mortality | Disease Burden | deaths per 100,000 |
| UHCER_TB | Tuberculosis Mortality | Disease Burden | deaths per 100,000 |
| UHCER_HIV | HIV/AIDS Mortality | Disease Burden | deaths per 100,000 |

Support for 100+ additional indicators available via API.

## API Endpoints

### 1. Query Health Indicators

**GET** `/api/who/indicators`

Fetch indicators with filtering options.

**Query Parameters:**
- `country`: Filter by country name/code
- `category`: Filter by category (disease_burden, mortality, vaccination, etc.)
- `indicatorCode`: Filter by WHO indicator code
- `year`: Specific year
- `yearFrom`, `yearTo`: Year range
- `tags`: Comma-separated tags
- `limit`: Max results (default: 100)

**Example:**
```bash
curl "http://localhost:5000/api/who/indicators?country=USA&category=mortality&yearFrom=2015&yearTo=2023"
```

**Response:**
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
    },
    ...
  ],
  "count": 45
}
```

### 2. Get Specific Indicator

**GET** `/api/who/indicators/:indicatorCode`

Get all countries' data for a specific indicator.

**Example:**
```bash
curl "http://localhost:5000/api/who/indicators/M_004?year=2023"
```

### 3. Get Country Health Profile

**GET** `/api/who/country/:country`

Get all health indicators for a specific country.

**Example:**
```bash
curl "http://localhost:5000/api/who/country/India"
```

**Response:**
```json
{
  "success": true,
  "country": "India",
  "totalIndicators": 45,
  "byCategory": {
    "mortality": [...],
    "disease_burden": [...],
    "vaccination": [...]
  }
}
```

### 4. Disease Burden Comparison

**GET** `/api/who/disease-burden/:indicator`

Compare a disease indicator across countries (ranked).

**Query Parameters:**
- `year`: Year to compare (default: 2023)

**Example:**
```bash
curl "http://localhost:5000/api/who/disease-burden/UHCER_TB?year=2023"
```

**Response:**
```json
{
  "success": true,
  "indicator": "UHCER_TB",
  "year": 2023,
  "comparison": [
    {
      "country": "India",
      "value": 28.5,
      "unit": "deaths per 100,000",
      "quality": "high"
    },
    {
      "country": "South Africa",
      "value": 22.1,
      ...
    },
    ...
  ],
  "topAffected": [10 worst-affected countries]
}
```

### 5. Fetch WHO Data

**POST** `/api/who/fetch`

Trigger data ingestion from WHO API.

**Body:**
```json
{
  "indicatorCodes": ["M_003", "M_004", "M_005"],
  "countries": ["USA", "IND", "GBR", "BRA", "ZAF"],
  "fromYear": 2015,
  "toYear": 2023
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/who/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "countries": ["USA", "United Kingdom", "China"],
    "fromYear": 2020,
    "toYear": 2023
  }'
```

**Note:** If `indicatorCodes` and `countries` are not provided, it uses defaults. This can take several minutes for large datasets.

### 6. Get Training Dataset

**GET** `/api/who/training-dataset`

Get structured data ready for AI model training.

**Query Parameters:**
- `category`: Data category (default: disease_burden)
- `minYear`: Start year (default: 2015)
- `maxYear`: End year (default: 2023)
- `minCountries`: Minimum countries needed (default: 10)

**Example:**
```bash
curl "http://localhost:5000/api/who/training-dataset?category=mortality&minYear=2010&maxYear=2023"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "mortality",
    "period": { "from": 2010, "to": 2023 },
    "statistics": {
      "totalCountries": 45,
      "totalYears": 14,
      "totalRecords": 630
    },
    "countries": ["USA", "India", "Brazil", ...],
    "years": [2010, 2011, ..., 2023],
    "dataset": {
      "United States of America": {
        "2023": {
          "M_003": { "value": 8.3, "unit": "per 1000 population" },
          "M_004": { "value": 5.6, "unit": "per 1000 live births" },
          ...
        },
        "2022": { ... },
        ...
      },
      "India": { ... },
      ...
    }
  }
}
```

### 7. List Available Indicators

**GET** `/api/who/available-indicators`

Get list of all pre-configured WHO indicators.

**Example:**
```bash
curl "http://localhost:5000/api/who/available-indicators"
```

### 8. Get Summary

**GET** `/api/who/summary`

Get overview of stored WHO data.

**Example:**
```bash
curl "http://localhost:5000/api/who/summary"
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalRecords": 1250,
    "uniqueCountries": 45,
    "uniqueIndicators": 18,
    "categories": 8,
    "yearRange": { "minYear": 2010, "maxYear": 2023 },
    "lastUpdated": "2026-02-21T23:30:00Z"
  },
  "topCountries": ["USA", "India", "Brazil", ...],
  "indicatorCategories": ["disease_burden", "mortality", "vaccination", ...]
}
```

## Usage Examples

### Example 1: Initialize with Default Data

```bash
# Fetch default indicators for major countries
curl -X POST http://localhost:5000/api/who/fetch
```

### Example 2: Get Training Data for Disease Burden Analysis

```bash
# Get dataset for modeling disease trends
curl "http://localhost:5000/api/who/training-dataset?category=disease_burden&minYear=2015&maxYear=2023"
```

### Example 3: Compare Mortality Across Countries

```bash
# Get infant mortality rates across all countries with data
curl "http://localhost:5000/api/who/disease-burden/M_004?year=2023"

# Filter and rank countries by infant mortality
```

### Example 4: Get Complete Country Health Profile

```bash
# Get all health metrics for India
curl "http://localhost:5000/api/who/country/India?limit=50"
```

### Example 5: Trend Analysis

```bash
# Get mortality rate trend for a country over 10 years
curl "http://localhost:5000/api/who/indicators?country=Brazil&indicatorCode=M_003&yearFrom=2014&yearTo=2023"
```

## Database Schema

### HealthIndicator Collection

```javascript
{
  _id: ObjectId,
  indicatorCode: String,           // WHO code (e.g., "M_003")
  indicatorName: String,           // Display name
  description: String,
  category: String,                // disease_burden, mortality, vaccination, etc.
  dataSource: {
    type: "who_gho",
    sourceId: String,
    sourceUrl: String
  },
  geography: {
    country: String,
    countryCode: String,            // ISO 3166-1 alpha-3
    region: String,
    latitude: Number,
    longitude: Number
  },
  year: Number,                     // Year of data
  value: Decimal128,                // Numeric value
  unit: String,                     // Unit of measurement
  dataQuality: String,              // high, medium, low, estimated
  populationAge: String,            // all_ages, under_5, 50_69, 70_plus
  populationGender: String,         // both, male, female
  interpretation: {
    normalRange: { low, high },
    targetValue: Decimal128,
    trend: String                   // improving, declining, stable
  },
  confidenceInterval: {
    lower: Decimal128,
    upper: Decimal128
  },
  notes: String,
  normalizedFhir: {
    resourceType: String,
    code: String,
    system: String
  },
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Integration with Your AI Model

### Step 1: Fetch Training Data

```python
# Get structured dataset from your API
import requests

response = requests.get('http://localhost:5000/api/who/training-dataset', 
  params={'category': 'disease_burden', 'minYear': 2015, 'maxYear': 2023})

dataset = response.json()['data']
```

### Step 2: Prepare Features

```python
# Convert to pandas DataFrame for ML
import pandas as pd

features = []
for country in dataset['countries']:
  for year in dataset['years']:
    row = dataset['dataset'].get(country, {}).get(year, {})
    if row:
      features.append({
        'country': country,
        'year': year,
        **row  # All health indicators
      })

df = pd.DataFrame(features)
```

### Step 3: Add Patient-Level Data

```python
# Combine with your EHR/wearable patient data
patient_response = requests.get('http://localhost:5000/api/ingestion/observations', 
  params={'limit': 1000})

patient_data = patient_response.json()['data']

# Join with population-level indicators by country and timestamp
combined_dataset = merge_patient_and_population_data(patient_data, df)
```

### Step 4: Train AI Model

```python
# Use combined dataset for training your preventive health model
from sklearn.ensemble import RandomForestRegressor

X = combined_dataset[['age', 'gender', 'disease_burden_score', 'mortality_rate', ...]]
y = combined_dataset['health_risk_score']

model = RandomForestRegressor()
model.fit(X, y)
```

## Configuration

No special configuration needed. The service uses the public WHO GHO API.

**Environment Variables (optional):**
```env
# In your .env file
WHO_API_BASE_URL=https://www.who.int/data/gho
WHO_API_TIMEOUT=15000  # milliseconds
WHO_CACHE_TTL=86400    # 24 hours (future enhancement)
```

## Data Quality & Limitations

- **Coverage**: Data available for most countries, though some have gaps
- **Timeliness**: Most recent data is 1-2 years old (lag from WHO publication)
- **Estimates**: Some values are WHO estimates based on modeling
- **Population Data**: WHO data is aggregated; individual identifiers are not included
- **Rate Limiting**: The WHO API is public but has implicit rate limits; the service includes delays to respect this

## Performance Notes

- Default fetch: ~50 records takes 5-10 seconds
- Full bulk ingest (100+ countries × 50+ indicators): 10-30 minutes
- Queries on indexed fields: <100ms
- Training dataset generation: <1 second for 500-1000 records

## Troubleshooting

### No data returned for a country

- Check country name/code: Use exact WHO name (e.g., "United States of America")
- Verify indicator availability for that country
- Check year range availability

### Slow fetch requests

- WHO API can be slow (~100-500ms per indicator)
- Service includes 100ms delays between requests to respect rate limits
- Consider querying existing data instead of fetching

### Memory issues with large datasets

- Limit year range in training dataset query
- Use `limit` parameter on indicator queries
- Request data category by category instead of all at once

## Future Enhancements

- [ ] Caching with TTL for frequently accessed indicators
- [ ] Batch CSV/Excel export for training datasets
- [ ] Real-time WHO data updates (webhook)
- [ ] Map visualization endpoints
- [ ] Correlation analysis between indicators
- [ ] Forecast future values using time series models
- [ ] Integration with CDC, World Bank, UN data sources
- [ ] Mobile app API for field data collection

## References

- WHO Global Health Observatory: https://www.who.int/data/gho
- WHO Code of Practice: https://www.who.int/about/code-of-practice
- FHIR Population Health Observation: https://hl7.org/fhir/observation.html
- Data Privacy: WHO respects GDPR for all data

---

**Last Updated**: February 21, 2026

**Contact**: health.data@example.com for questions about WHO data integration
