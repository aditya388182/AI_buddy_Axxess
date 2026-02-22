/**
 * Test Suite for Anomaly Detection Pipeline
 * Run with: node backend/ai/test-pipeline.js
 */

const AnomalyDetectionPipeline = require('./pipeline');

async function runTests() {
  console.log('🧪 Testing Anomaly Detection Pipeline...\n');

  const pipeline = new AnomalyDetectionPipeline();

  // Test 1: Health Check
  console.log('Test 1: Health Check');
  try {
    const health = await pipeline.healthCheck();
    console.log('✅ Health check passed:', health);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  console.log('');

  // Test 2: Vital Signs Anomaly Detection
  console.log('Test 2: Vital Signs Anomaly Detection');
  try {
    const vitals = {
      bloodPressure: { systolic: 180, diastolic: 110 },
      heartRate: 120,
      temperature: 38.5,
      respiratoryRate: 24,
      oxygenSaturation: 92,
      timestamp: new Date().toISOString(),
    };

    const result = await pipeline.detectVitalAnomalies(vitals);
    console.log('✅ Vital analysis completed');
    console.log('Has Anomalies:', result.hasAnomalies);
    console.log('Severity:', result.severity);
    console.log('Anomalies Found:', result.anomalies?.length || 0);
    if (result.anomalies) {
      result.anomalies.forEach(anomaly => {
        console.log(`  - ${anomaly.parameter}: ${anomaly.value} (${anomaly.severity})`);
      });
    }
  } catch (error) {
    console.log('❌ Vital analysis failed:', error.message);
  }
  console.log('');

  // Test 3: Lab Results Anomaly Detection
  console.log('Test 3: Lab Results Anomaly Detection');
  try {
    const labResults = [
      { testName: 'Hemoglobin', value: 8.5, unit: 'g/dL' },
      { testName: 'White Blood Cell Count', value: 15000, unit: 'cells/μL' },
      { testName: 'Blood Glucose', value: 250, unit: 'mg/dL' },
      { testName: 'Creatinine', value: 2.5, unit: 'mg/dL' },
    ];

    const result = await pipeline.detectLabAnomalies(labResults);
    console.log('✅ Lab analysis completed');
    console.log('Has Anomalies:', result.hasAnomalies);
    console.log('Abnormal Results:', result.abnormalResults?.length || 0);
    console.log('Urgency:', result.urgency);
    if (result.possibleConditions) {
      console.log('Possible Conditions:', result.possibleConditions.join(', '));
    }
  } catch (error) {
    console.log('❌ Lab analysis failed:', error.message);
  }
  console.log('');

  // Test 4: Medication Anomaly Detection
  console.log('Test 4: Medication Anomaly Detection');
  try {
    const medications = [
      { name: 'Warfarin', dosage: '5mg', frequency: 'daily' },
      { name: 'Aspirin', dosage: '325mg', frequency: 'daily' },
      { name: 'Ibuprofen', dosage: '800mg', frequency: 'three times daily' },
    ];

    const patientInfo = {
      age: 65,
      conditions: ['Atrial Fibrillation', 'Hypertension'],
    };

    const result = await pipeline.detectMedicationAnomalies(medications, patientInfo);
    console.log('✅ Medication analysis completed');
    console.log('Has Anomalies:', result.hasAnomalies);
    console.log('Interactions Found:', result.interactions?.length || 0);
    if (result.interactions) {
      result.interactions.forEach(interaction => {
        console.log(`  - ${interaction.medications.join(' + ')}: ${interaction.severity}`);
        console.log(`    ${interaction.description}`);
      });
    }
    console.log('Requires Review:', result.requiresReview);
  } catch (error) {
    console.log('❌ Medication analysis failed:', error.message);
  }
  console.log('');

  // Test 5: General Patient Data Anomaly Detection
  console.log('Test 5: General Patient Data Anomaly Detection');
  try {
    const patientData = {
      demographics: {
        age: 45,
        gender: 'male',
      },
      vitals: {
        bloodPressure: { systolic: 160, diastolic: 95 },
        heartRate: 95,
        weight: 220,
        height: 70,
      },
      medications: [
        { name: 'Metformin', dosage: '1000mg', frequency: 'twice daily' },
      ],
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      recentLabs: [
        { testName: 'HbA1c', value: 9.2, unit: '%' },
      ],
    };

    const result = await pipeline.detectAnomalies(patientData);
    console.log('✅ General analysis completed');
    console.log('Data Quality Score:', result.dataQuality?.score);
    console.log('Clinical Anomalies:', result.clinicalAnomalies?.length || 0);
    console.log('Overall Risk:', result.riskAssessment?.overallRisk);
    console.log('Requires Provider Review:', result.requiresProviderReview);
  } catch (error) {
    console.log('❌ General analysis failed:', error.message);
  }
  console.log('');

  console.log('🎉 All tests completed!');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
