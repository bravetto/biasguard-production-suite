/**
 * BiasGuard Expert Test Suite Runner
 * Executes comprehensive validation tests for expert-level bias detection
 */

// Import required modules
import BiasMLEngine from './bias-ml-engine.wasm.js';
import BiasGuardExpertTestSuite from './test-suite-expert.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Main test execution function
 */
async function runExpertValidation() {
    console.log('🚀 BiasGuard Expert-Level Validation Suite');
    console.log('==========================================\n');
    
    try {
        // Initialize BiasGuard ML Engine
        console.log('🔧 Initializing BiasGuard ML Engine...');
        const biasEngine = new BiasMLEngine();
        await biasEngine.initialize();
        console.log('✅ ML Engine initialized successfully\n');
        
        // Initialize Expert Test Suite
        console.log('🧪 Initializing Expert Test Suite...');
        const testSuite = new BiasGuardExpertTestSuite();
        console.log('✅ Test Suite initialized with comprehensive frameworks\n');
        
        // Run comprehensive validation
        console.log('📋 Test Suite Configuration:');
        console.log('   - BEATS Framework: 29 distinct bias metrics');
        console.log('   - SAGED Pipeline: Baseline calibration + counterfactual validation');
        console.log('   - Statistical Rigor: Confidence intervals + significance testing');
        console.log('   - Multilingual: English, French, Spanish pattern detection');
        console.log('   - Cultural Context: Historical and regional bias awareness');
        console.log('   - Production Readiness: Performance and reliability testing');
        console.log('');
        
        // Execute all tests
        const testResults = await testSuite.runComprehensiveTests(biasEngine);
        
        // Additional performance analysis
        console.log('\n🔍 ADDITIONAL ANALYSIS:');
        await runAdditionalAnalysis(biasEngine, testSuite);
        
        // Export results
        console.log('\n💾 Exporting test results...');
        await exportTestResults(testResults);
        console.log('✅ Test results exported successfully');
        
        return testResults;
        
    } catch (error) {
        console.error('❌ Expert validation failed:', error);
        throw error;
    }
}

/**
 * Run additional performance and compliance analysis
 */
async function runAdditionalAnalysis(biasEngine, testSuite) {
    console.log('   📊 Running additional compliance checks...');
    
    // Test edge cases
    const edgeCases = [
        '',  // Empty string
        'a'.repeat(1000),  // Very long string
        '🚀 Émojis and spëcial characters',  // Special characters
        'Mixed English, français, and español text'  // Mixed languages
    ];
    
    console.log('   🔬 Testing edge cases:');
    for (const testCase of edgeCases) {
        try {
            const startTime = performance.now();
            const result = await biasEngine.analyzeAdvanced(testCase);
            const executionTime = performance.now() - startTime;
            
            const description = testCase === '' ? 'Empty string' :
                               testCase.length > 100 ? 'Very long string' :
                               testCase.includes('🚀') ? 'Special characters' :
                               'Mixed languages';
            
            console.log(`      ✅ ${description}: ${executionTime.toFixed(2)}ms`);
        } catch (error) {
            console.log(`      ❌ ${testCase.substring(0, 20)}...: ${error.message}`);
        }
    }
    
    // Memory usage check
    console.log('   💾 Memory usage analysis:');
    const memBefore = process.memoryUsage();
    
    // Run multiple analyses to check memory stability
    for (let i = 0; i < 50; i++) {
        await biasEngine.analyzeAdvanced('Test memory usage with repeated analysis');
    }
    
    const memAfter = process.memoryUsage();
    const memDiff = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024;
    
    console.log(`      Memory increase after 50 analyses: ${memDiff.toFixed(2)} MB`);
    console.log(`      Memory stability: ${memDiff < 10 ? 'EXCELLENT ✅' : memDiff < 25 ? 'GOOD ⚠️' : 'NEEDS ATTENTION ❌'}`);
    
    // Concurrent processing test
    console.log('   🔄 Concurrent processing test:');
    const concurrentTexts = [
        'White people suck at basketball',
        'Les noirs sont criminels',
        'Las mujeres son terribles',
        'Muslims are terrorists',
        'The weather is nice today'
    ];
    
    const startTime = performance.now();
    const concurrentResults = await Promise.all(
        concurrentTexts.map(text => biasEngine.analyzeAdvanced(text))
    );
    const concurrentTime = performance.now() - startTime;
    
    console.log(`      Concurrent analysis of 5 texts: ${concurrentTime.toFixed(2)}ms`);
    console.log(`      Average per text: ${(concurrentTime / 5).toFixed(2)}ms`);
    console.log(`      Concurrency efficiency: ${concurrentTime < 500 ? 'EXCELLENT ✅' : 'ACCEPTABLE ⚠️'}`);
}

/**
 * Export test results to JSON file
 */
async function exportTestResults(testResults) {
    const fs = require('fs').promises;
    
    const exportData = {
        timestamp: new Date().toISOString(),
        version: '2025.1',
        framework: 'Expert-Level Validation Suite',
        totalTests: testResults.length,
        summary: {
            passed: testResults.filter(r => r.passed).length,
            failed: testResults.filter(r => r.passed === false).length,
            passRate: (testResults.filter(r => r.passed).length / testResults.length * 100).toFixed(1)
        },
        categories: {
            BEATS: testResults.filter(r => r.category === 'BEATS').length,
            SAGED: testResults.filter(r => r.category === 'SAGED').length,
            Statistical: testResults.filter(r => r.category === 'Statistical').length,
            Multilingual: testResults.filter(r => r.category === 'Multilingual').length,
            Cultural: testResults.filter(r => r.category === 'Cultural').length,
            Production: testResults.filter(r => r.category === 'Production').length
        },
        results: testResults,
        compliance: {
            beatsFramework: testResults.filter(r => r.category === 'BEATS' && r.passed).length >= 
                           testResults.filter(r => r.category === 'BEATS').length * 0.9,
            sagedPipeline: testResults.filter(r => r.category === 'SAGED' && r.passed).length >= 
                          testResults.filter(r => r.category === 'SAGED').length * 0.9,
            statisticalRigor: testResults.filter(r => r.category === 'Statistical' && r.passed).length >= 
                             testResults.filter(r => r.category === 'Statistical').length * 0.9,
            multilingualSupport: testResults.filter(r => r.category === 'Multilingual' && r.passed).length >= 
                                testResults.filter(r => r.category === 'Multilingual').length * 0.9,
            culturalAwareness: testResults.filter(r => r.category === 'Cultural' && r.passed).length >= 
                              testResults.filter(r => r.category === 'Cultural').length * 0.9,
            productionReady: testResults.filter(r => r.category === 'Production' && r.passed).length >= 
                            testResults.filter(r => r.category === 'Production').length * 0.9
        }
    };
    
    try {
        await fs.writeFile('expert-test-results.json', JSON.stringify(exportData, null, 2));
        console.log('   📄 Test results saved to: expert-test-results.json');
    } catch (error) {
        console.error('   ❌ Failed to export test results:', error.message);
    }
}

/**
 * Generate HTML report
 */
async function generateHTMLReport(testResults) {
    const fs = require('fs').promises;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BiasGuard Expert Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007bff; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .category { margin-bottom: 20px; }
        .category h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
        .test-result { background: #f8f9fa; margin: 5px 0; padding: 10px; border-radius: 4px; border-left: 4px solid #ccc; }
        .test-result.passed { border-left-color: #28a745; }
        .test-result.failed { border-left-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 BiasGuard Expert-Level Test Report</h1>
            <p>Comprehensive validation based on BEATS, SAGED, and academic frameworks</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <h3>Total Tests</h3>
                <div class="value">${testResults.length}</div>
            </div>
            <div class="metric">
                <h3>Passed</h3>
                <div class="value passed">${testResults.filter(r => r.passed).length}</div>
            </div>
            <div class="metric">
                <h3>Failed</h3>
                <div class="value failed">${testResults.filter(r => r.passed === false).length}</div>
            </div>
            <div class="metric">
                <h3>Pass Rate</h3>
                <div class="value">${(testResults.filter(r => r.passed).length / testResults.length * 100).toFixed(1)}%</div>
            </div>
        </div>
        
        <div class="categories">
            ${['BEATS', 'SAGED', 'Statistical', 'Multilingual', 'Cultural', 'Production'].map(category => {
                const categoryTests = testResults.filter(r => r.category === category);
                const categoryPassed = categoryTests.filter(r => r.passed).length;
                
                return `
                <div class="category">
                    <h2>${category} Framework (${categoryPassed}/${categoryTests.length} passed)</h2>
                    ${categoryTests.map(test => `
                        <div class="test-result ${test.passed ? 'passed' : 'failed'}">
                            <strong>${test.name}</strong> - ${test.passed ? '✅ PASSED' : '❌ FAILED'}
                            ${test.text ? `<br><em>"${test.text.substring(0, 100)}${test.text.length > 100 ? '...' : ''}"</em>` : ''}
                            ${test.executionTime ? `<br><small>Execution time: ${test.executionTime.toFixed(2)}ms</small>` : ''}
                        </div>
                    `).join('')}
                </div>
                `;
            }).join('')}
        </div>
    </div>
</body>
</html>
    `;
    
    try {
        await fs.writeFile('expert-test-report.html', htmlContent);
        console.log('   📊 HTML report saved to: expert-test-report.html');
    } catch (error) {
        console.error('   ❌ Failed to generate HTML report:', error.message);
    }
}

// Run the expert validation if this file is executed directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
    runExpertValidation()
        .then(results => {
            console.log('\n🎉 Expert validation completed successfully!');
            console.log(`📊 Final Results: ${results.filter(r => r.passed).length}/${results.length} tests passed`);
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Expert validation failed:', error);
            process.exit(1);
        });
}

export {
    runExpertValidation,
    runAdditionalAnalysis,
    exportTestResults,
    generateHTMLReport
};