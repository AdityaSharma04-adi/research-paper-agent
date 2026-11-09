import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAMPLE_PAPERS,
  getSamplePaperById,
  validatePaperAnalysis,
  generateDeterministicAnalysis,
  exportAnalysisToMarkdown
} from './paperAnalysis';

test('SAMPLE_PAPERS contains valid preloaded papers with title and text', () => {
  assert.ok(SAMPLE_PAPERS.length >= 3);
  for (const paper of SAMPLE_PAPERS) {
    assert.ok(paper.id.length > 0);
    assert.ok(paper.title.length > 0);
    assert.ok(paper.text.length > 50);
  }
});

test('getSamplePaperById retrieves the correct sample paper', () => {
  const paper = getSamplePaperById('attention');
  assert.ok(paper);
  assert.equal(paper.id, 'attention');
  assert.match(paper.title, /Attention Is All You Need/);
});

test('generateDeterministicAnalysis produces 5 valid Chain-of-Thought steps', () => {
  const sample = SAMPLE_PAPERS[0];
  const analysis = generateDeterministicAnalysis(sample.title, sample.text);

  // Validate overall structure
  assert.ok(validatePaperAnalysis(analysis));
  assert.equal(analysis.title, sample.title);

  // Step 1: Core Problem
  assert.ok(analysis.step1CoreProblem.problemStatement.length > 0);
  assert.ok(analysis.step1CoreProblem.existingGap.length > 0);
  assert.ok(analysis.step1CoreProblem.significance.length > 0);

  // Step 2: Architecture & Methodology
  assert.ok(analysis.step2Architecture.approachSummary.length > 0);
  assert.ok(analysis.step2Architecture.keyComponents.length >= 2);
  assert.ok(analysis.step2Architecture.novelty.length > 0);

  // Step 3: Key Results & Metrics
  assert.ok(analysis.step3Results.benchmarks.length >= 2);
  assert.ok(analysis.step3Results.summary.length > 0);
  assert.ok(analysis.step3Results.benchmarks[0].metricName);
  assert.ok(analysis.step3Results.benchmarks[0].resultValue);

  // Step 4: Critical Limitations
  assert.ok(analysis.step4Limitations.assumptions.length >= 1);
  assert.ok(analysis.step4Limitations.tradeOffs.length >= 1);
  assert.ok(analysis.step4Limitations.failureModes.length >= 1);

  // Step 5: Practical Takeaways (2-3 actionable bullet points)
  assert.ok(analysis.step5Takeaways.actionablePoints.length >= 2);
  assert.ok(analysis.step5Takeaways.actionablePoints.length <= 4);
});

test('exportAnalysisToMarkdown formats structured markdown document with all 5 sections', () => {
  const sample = SAMPLE_PAPERS[1]; // DeepSeek-R1
  const analysis = generateDeterministicAnalysis(sample.title, sample.text);
  const md = exportAnalysisToMarkdown(analysis);

  assert.match(md, /# Research Paper Analysis:/);
  assert.match(md, /## 1\. Core Problem/);
  assert.match(md, /## 2\. Architecture & Methodology/);
  assert.match(md, /## 3\. Key Results & Metrics/);
  assert.match(md, /## 4\. Critical Limitations/);
  assert.match(md, /## 5\. Practical Takeaways/);
  assert.match(md, /\| Benchmark \/ Metric \| Outcome \| Baseline Comparison \|/);
});

test('validatePaperAnalysis correctly rejects malformed objects', () => {
  assert.equal(validatePaperAnalysis(null), false);
  assert.equal(validatePaperAnalysis({}), false);
  assert.equal(validatePaperAnalysis({ title: 'Paper', step1CoreProblem: {} }), false);
});
