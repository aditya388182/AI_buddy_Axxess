/**
 * Test Suite for Data Transformation Service
 * Run with: node backend/ai/test-transform.js
 */

const DataTransformationService = require('./transform_data');

async function runTests() {
  console.log('🧪 Testing Data Transformation Service...\n');

  const service = new DataTransformationService();

  // Test 1: Health Check
  console.log('Test 1: Health Check');
  try {
    const health = await service.healthCheck();
    console.log('✅ Health check passed:', health);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  console.log('');

  // Test 2: Clean and Structure Raw Medical Notes
  console.log('Test 2: Clean and Structure Raw Medical Notes');
  try {
    const rawNotes = "Pt name: John Doe, 45yo male. BP 140/90. Temp 102F. Taking 500mg Metformin twice daily. Labs show Glucose at 45 mg/dL. Pt complains of dizziness and sweating.";
    
    console.log('Raw Input:', rawNotes);
    console.log('');
    
    const cleaned = await service.cleanOnly(rawNotes);
    console.log('✅ Data cleaned and structured');
    console.log('Structured Output:', JSON.stringify(cleaned, null, 2));
  } catch (error) {
    console.log('❌ Data cleaning failed:', error.message);
  }
  console.log('');

  // Test 3: Full Pipeline (Clean + Detect Anomalies)
  console.log('Test 3: Full Pipeline - Clean and Detect Anomalies');
  try {
    const rawData = "Patient: Jane Smith, 68 years old. BP reading 180/110 mmHg. Heart rate 120 bpm. Taking Warfarin 5mg daily and Aspirin 325mg daily. Recent lab: INR 4.5, hemoglobin 8.2 g/dL. Complains of nosebleeds and fatigue.";
    
    console.log('Raw Input:', rawData);
    console.log('');
    
    const result = await service.processPatientData(rawData);
    console.log('✅ Full pipeline completed');
    console.log('\nStructured Data:');
    console.log(JSON.stringify(result.structured, null, 2));
    console.log('\nAnomaly Report:');
    console.log('Has Anomalies:', result.anomalies.hasAnomalies);
    console.log('Risk Level:', result.anomalies.riskLevel);
    console.log('Requires Immediate Attention:', result.anomalies.requiresImmediateAttention);
    
    if (result.anomalies.criticalFindings) {
      console.log('\nCritical Findings:');
      result.anomalies.criticalFindings.forEach((finding, index) => {
        console.log(`  ${index + 1}. [${finding.severity.toUpperCase()}] ${finding.finding}`);
        console.log(`     Reasoning: ${finding.reasoning}`);
        console.log(`     Recommendation: ${finding.recommendation}`);
      });
    }
    
    if (result.anomalies.contradictions && result.anomalies.contradictions.length > 0) {
      console.log('\nContradictions:');
      result.anomalies.contradictions.forEach(contradiction => {
        console.log(`  - ${contradiction.issue}`);
        console.log(`    ${contradiction.explanation}`);
      });
    }
  } catch (error) {
    console.log('❌ Full pipeline failed:', error.message);
  }
  console.log('');

  // Test 4: Transform Lab Results
  console.log('Test 4: Transform Lab Results');
  try {
    const rawLabData = `
      CBC Results:
      - WBC: 15,000 cells/uL
      - RBC: 3.5 million/uL
      - Hemoglobin: 10.2
      - Platelets: 450,000
      
      Chemistry:
      - Glucose: 280 mg/dL
      - Creatinine: 2.8
      - BUN: 45 mg/dL
    `;
    
    const labs = await service.transformLabResults(rawLabData);
    console.log('✅ Lab results transformed');
    console.log('Structured Labs:', JSON.stringify(labs, null, 2));
  } catch (error) {
    console.log('❌ Lab transformation failed:', error.message);
  }
  console.log('');

  // Test 5: Complex Case - Multiple Issues
  console.log('Test 5: Complex Case with Multiple Issues');
  try {
    const complexCase = `
      Patient: Robert Johnson, 72-year-old male
      Chief Complaint: Chest pain and shortness of breath
      
      Vitals:
      - BP: 90/60 mmHg (usually 130/80)
      - HR: 45 bpm (irregular)
      - SpO2: 88% on room air
      - Temp: 98.6F
      
      Medications:
      - Metoprolol 200mg BID
      - Digoxin 0.5mg daily
      - Lasix 80mg BID
      
      Recent Labs:
      - Potassium: 2.8 mEq/L
      - Digoxin level: 3.2 ng/mL
      - BNP: 1200 pg/mL
      
      History: CHF, Atrial fibrillation, Chronic kidney disease
    `;
    
    const result = await service.processPatientData(complexCase);
    console.log('✅ Complex case analyzed');
    console.log('\nRisk Assessment:', result.anomalies.riskLevel);
    console.log('Immediate Attention Required:', result.anomalies.requiresImmediateAttention);
    console.log('\nClinical Summary:', result.anomalies.clinicalSummary);
  } catch (error) {
    console.log('❌ Complex case analysis failed:', error.message);
  }
  console.log('');

  console.log('🎉 All tests completed!');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
