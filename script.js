/**
 * SmartSummarizer – Text Summarization
 * College Text & Speech Analysis (TSA) Lab Experiment 04
 * Pure Client-Side Extractive Text Summarization Engine
 */

// Comprehensive English Stop Words Set
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'just',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  // Common conversational / academic fillers
  'also', 'within', 'across', 'using', 'often', 'many', 'well', 'much', 'even', 'one', 'two'
]);

// Sample Paragraph on AI & Healthcare
const EXAMPLE_AI_HEALTHCARE = `Artificial intelligence is rapidly transforming modern healthcare by accelerating diagnostic precision, optimizing treatment pathways, and personalizing patient clinical care. Advanced machine learning models analyze complex medical imaging such as MRI scans, computed tomography, and digital pathology with accuracy that rivals seasoned radiologists. In clinical oncology, predictive neural networks detect malignant cellular mutations months before visible symptomatic onset, empowering physicians to administer proactive therapeutic interventions. Natural language processing algorithms sift through millions of unstructured electronic health records, reducing clinical documentation burdens and allowing medical personnel to devote greater focus to direct patient bedside care. Predictive epidemiological models forecast patient admission spikes, enabling hospital administrators to proactively allocate critical intensive care unit beds and medical resources. Despite these profound breakthroughs, deploying healthcare AI necessitates rigorous ethical governance, algorithmic transparency, and stringent demographic validation to prevent algorithmic bias. Ultimately, artificial intelligence is engineered not to displace human medical practitioners, but to elevate their diagnostic acumen and enrich the delivery of compassionate, evidence-based medicine.`;

// DOM Element References
const inputText = document.getElementById('inputText');
const liveCharCount = document.getElementById('liveCharCount');
const liveWordCount = document.getElementById('liveWordCount');
const liveSentCount = document.getElementById('liveSentCount');

const btnLoadExample = document.getElementById('btnLoadExample');
const btnClear = document.getElementById('btnClear');
const btnSummarize = document.getElementById('btnSummarize');
const btnCopySummary = document.getElementById('btnCopySummary');
const copyBtnText = document.getElementById('copyBtnText');

const lengthSlider = document.getElementById('lengthSlider');
const sliderValueBadge = document.getElementById('sliderValueBadge');
const tickLabels = document.querySelectorAll('.tick-label');

const resultsSection = document.getElementById('resultsSection');
const summaryTextOutput = document.getElementById('summaryTextOutput');
const originalHighlightedOutput = document.getElementById('originalHighlightedOutput');
const toggleHighlights = document.getElementById('toggleHighlights');

// Metric Elements
const metricOrigWords = document.getElementById('metricOrigWords');
const metricOrigSentences = document.getElementById('metricOrigSentences');
const metricSummWords = document.getElementById('metricSummWords');
const metricSummSentences = document.getElementById('metricSummSentences');
const metricSentenceRatio = document.getElementById('metricSentenceRatio');
const metricSentencePct = document.getElementById('metricSentencePct');
const metricCompression = document.getElementById('metricCompression');
const compressionBarFill = document.getElementById('compressionBarFill');

const summarySentCountBadge = document.getElementById('summarySentCountBadge');
const originalSentCountBadge = document.getElementById('originalSentCountBadge');
const readingTimeBadge = document.getElementById('readingTimeBadge');

// Inspector & Keywords
const inspectorTableBody = document.getElementById('inspectorTableBody');
const keywordTagsContainer = document.getElementById('keywordTagsContainer');
const vocabCountBadge = document.getElementById('vocabCountBadge');

// View Tabs
const tabButtons = document.querySelectorAll('.view-tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// State Cache
let currentSummaryString = '';

/* ==========================================================================
   Text Preprocessing & Extractive Summarization Algorithm
   ========================================================================== */

/**
 * Step 1: Split raw text into sentences while guarding common abbreviations
 */
function splitIntoSentences(text) {
  if (!text || !text.trim()) return [];

  // Protect common abbreviations and decimals with placeholders
  let normalized = text
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof|Sr|Jr|vs|etc|e\.g|i\.e|Fig|al)\./gi, '$1{{DOT}}')
    .replace(/(\d)\.(\d)/g, '$1{{DECIMAL}}$2')
    .replace(/\.{3,}/g, '{{ELLIPSIS}}');

  // Match sentence boundary (. ! ? followed by space/newline or end of text)
  const rawSentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  return rawSentences
    .map(s => s
      .replace(/{{DOT}}/g, '.')
      .replace(/{{DECIMAL}}/g, '.')
      .replace(/{{ELLIPSIS}}/g, '...')
      .trim()
    )
    .filter(s => s.length > 0);
}

/**
 * Step 2: Tokenize text into lowercase words
 */
function tokenizeWords(text) {
  if (!text) return [];
  const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  return words;
}

/**
 * Step 3 & 4: Calculate word frequency matrix filtering out stop words
 */
function calculateWordFrequencies(sentences) {
  const freqMap = {};

  sentences.forEach(sentence => {
    const words = tokenizeWords(sentence);
    words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }
    });
  });

  // Find max frequency for term normalization
  let maxFreq = 0;
  for (const word in freqMap) {
    if (freqMap[word] > maxFreq) {
      maxFreq = freqMap[word];
    }
  }

  // Calculate normalized frequency W_norm = f(w) / maxFreq
  const normalizedFreqMap = {};
  for (const word in freqMap) {
    normalizedFreqMap[word] = maxFreq > 0 ? (freqMap[word] / maxFreq) : 0;
  }

  return { freqMap, normalizedFreqMap, maxFreq };
}

/**
 * Step 5: Score each sentence based on constituent word frequencies and length normalization
 */
function scoreSentences(sentences, normalizedFreqMap) {
  return sentences.map((sentence, index) => {
    const words = tokenizeWords(sentence);
    let rawScore = 0;
    let nonStopWordCount = 0;

    words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        rawScore += (normalizedFreqMap[word] || 0);
        nonStopWordCount++;
      }
    });

    // Length normalization factor: balances raw sum with sentence length
    // Dividing by sqrt(wordCount) prevents bias towards huge run-on sentences
    const wordCount = words.length;
    const normalizedScore = wordCount > 0 ? (rawScore / Math.sqrt(wordCount)) : 0;

    return {
      index,
      text: sentence,
      wordCount,
      nonStopWordCount,
      rawScore: parseFloat(rawScore.toFixed(3)),
      normalizedScore: parseFloat(normalizedScore.toFixed(3)),
      selected: false,
      rank: 0
    };
  });
}

/**
 * Step 6 & 7: Top-K selection and chronological order preservation
 */
function performExtractiveSummarization(text, lengthMode = 2) {
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    return {
      error: 'Please enter at least one sentence.',
      sentences: [],
      selectedSentences: [],
      summaryText: '',
      wordFrequencies: {}
    };
  }

  const { freqMap, normalizedFreqMap } = calculateWordFrequencies(sentences);
  const scoredSentences = scoreSentences(sentences, normalizedFreqMap);

  // Assign global ranks based on normalized score (descending)
  const rankedSentences = [...scoredSentences].sort((a, b) => b.normalizedScore - a.normalizedScore);
  rankedSentences.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // Determine number of sentences to extract (K) based on length slider
  // 1 = Short (25-30%), 2 = Medium (45-50%), 3 = Long (65-70%)
  const totalSentences = sentences.length;
  let targetCount;

  if (lengthMode === 1) {
    // Short
    targetCount = Math.max(1, Math.ceil(totalSentences * 0.30));
  } else if (lengthMode === 3) {
    // Long
    targetCount = Math.max(1, Math.min(totalSentences, Math.ceil(totalSentences * 0.70)));
  } else {
    // Medium (Default)
    targetCount = Math.max(1, Math.min(totalSentences, Math.ceil(totalSentences * 0.50)));
  }

  // Handle small paragraphs: ensure summary is strictly shorter than original if total > 1
  if (totalSentences > 1 && targetCount >= totalSentences) {
    targetCount = totalSentences - 1;
  }

  // Select top K sentences
  const selectedIndices = new Set(
    rankedSentences.slice(0, targetCount).map(s => s.index)
  );

  // Update selected status in original order
  scoredSentences.forEach(s => {
    s.selected = selectedIndices.has(s.index);
  });

  // Step 7: Chronological Order Preservation
  // Filter selected sentences and keep their original sequence
  const selectedSentences = scoredSentences.filter(s => s.selected);
  const summaryText = selectedSentences.map(s => s.text).join(' ');

  return {
    originalSentences: scoredSentences,
    selectedSentences,
    summaryText,
    freqMap,
    totalOriginalWords: countWords(text),
    totalSummaryWords: countWords(summaryText)
  };
}

/**
 * Word count utility
 */
function countWords(str) {
  if (!str) return 0;
  const matches = str.trim().match(/\b[a-zA-Z0-9_\-']+\b/g);
  return matches ? matches.length : 0;
}

/* ==========================================================================
   UI Event Handlers & View Rendering
   ========================================================================== */

/**
 * Updates live character, word, and sentence counts in textarea
 */
function updateLiveCounters() {
  const text = inputText.value;
  const chars = text.length;
  const words = countWords(text);
  const sentences = splitIntoSentences(text).length;

  liveCharCount.textContent = `${chars.toLocaleString()} character${chars === 1 ? '' : 's'}`;
  liveWordCount.textContent = `${words.toLocaleString()} word${words === 1 ? '' : 's'}`;
  liveSentCount.textContent = `${sentences} sentence${sentences === 1 ? '' : 's'}`;
}

/**
 * Handle Slider Changes
 */
function updateSliderUI() {
  const val = parseInt(lengthSlider.value, 10);
  tickLabels.forEach(tick => {
    tick.classList.toggle('active', parseInt(tick.dataset.val, 10) === val);
  });

  sliderValueBadge.className = 'length-badge';
  if (val === 1) {
    sliderValueBadge.classList.add('short');
    sliderValueBadge.textContent = 'Short (~30%)';
  } else if (val === 2) {
    sliderValueBadge.classList.add('medium');
    sliderValueBadge.textContent = 'Medium (~50%)';
  } else {
    sliderValueBadge.classList.add('long');
    sliderValueBadge.textContent = 'Long (~70%)';
  }
}

/**
 * Load Example Document
 */
function loadExample() {
  inputText.value = EXAMPLE_AI_HEALTHCARE;
  updateLiveCounters();
  runSummarization();
}

/**
 * Clear All
 */
function clearAll() {
  inputText.value = '';
  updateLiveCounters();
  resultsSection.style.display = 'none';
  summaryTextOutput.innerHTML = '';
  originalHighlightedOutput.innerHTML = '';
  inspectorTableBody.innerHTML = '';
  keywordTagsContainer.innerHTML = '';
  currentSummaryString = '';
}

/**
 * Render Results & Metrics
 */
function renderResults(result) {
  resultsSection.style.display = 'flex';

  const origWords = result.totalOriginalWords;
  const sumWords = result.totalSummaryWords;
  const origSentCount = result.originalSentences.length;
  const sumSentCount = result.selectedSentences.length;

  // Calculate Compression Percentage
  let compressionPct = 0;
  if (origWords > 0) {
    compressionPct = Math.max(0, Math.min(100, ((1 - (sumWords / origWords)) * 100)));
  }

  // Update Metric Cards
  metricOrigWords.textContent = origWords.toLocaleString();
  metricOrigSentences.textContent = `${origSentCount} sentence${origSentCount === 1 ? '' : 's'}`;

  metricSummWords.textContent = sumWords.toLocaleString();
  metricSummSentences.textContent = `${sumSentCount} sentence${sumSentCount === 1 ? '' : 's'}`;

  metricSentenceRatio.textContent = `${sumSentCount} / ${origSentCount}`;
  const sentRatioPct = origSentCount > 0 ? Math.round((sumSentCount / origSentCount) * 100) : 0;
  metricSentencePct.textContent = `${sentRatioPct}% retained`;

  metricCompression.textContent = `${compressionPct.toFixed(1)}%`;
  compressionBarFill.style.width = `${compressionPct.toFixed(1)}%`;

  // Summary Card Footers
  summarySentCountBadge.textContent = sumSentCount;
  originalSentCountBadge.textContent = origSentCount;

  // Estimated reading time (~200 wpm)
  const estSeconds = Math.max(5, Math.round((sumWords / 200) * 60));
  readingTimeBadge.textContent = `⏱️ ~${estSeconds < 60 ? `${estSeconds}s` : `${Math.ceil(estSeconds / 60)}m`} read`;

  // Render Generated Summary with sentence spans
  currentSummaryString = result.summaryText;
  summaryTextOutput.innerHTML = '';
  result.selectedSentences.forEach((s) => {
    const span = document.createElement('span');
    span.className = 'summary-sentence';
    span.textContent = s.text + ' ';
    summaryTextOutput.appendChild(span);
  });

  // Render Original Text with Highlights
  originalHighlightedOutput.innerHTML = '';
  originalHighlightedOutput.classList.add('highlights-active');
  result.originalSentences.forEach((s) => {
    const span = document.createElement('span');
    span.className = `orig-sentence ${s.selected ? 'is-extracted' : ''}`;
    span.textContent = s.text + ' ';
    span.title = `Score: ${s.normalizedScore} | Rank: #${s.rank}${s.selected ? ' (Selected)' : ''}`;
    originalHighlightedOutput.appendChild(span);
  });

  // Render Inspector Table (Sorted by original appearance, showing Rank and Status)
  inspectorTableBody.innerHTML = '';
  result.originalSentences.forEach((s) => {
    const tr = document.createElement('tr');
    if (s.selected) tr.classList.add('selected-row');

    tr.innerHTML = `
      <td><strong>${s.index + 1}</strong></td>
      <td class="table-sentence-preview">${escapeHtml(s.text)}</td>
      <td><code>${s.wordCount}</code></td>
      <td><code>${s.rawScore}</code></td>
      <td><code>${s.normalizedScore}</code></td>
      <td><span class="rank-badge ${s.rank <= 3 ? 'top-rank' : ''}">#${s.rank}</span></td>
      <td>
        <span class="status-tag ${s.selected ? 'included' : 'excluded'}">
          ${s.selected ? '✔ Included' : '✘ Omitted'}
        </span>
      </td>
    `;
    inspectorTableBody.appendChild(tr);
  });

  // Render Keyword Frequency Matrix
  keywordTagsContainer.innerHTML = '';
  const sortedKeywords = Object.entries(result.freqMap).sort((a, b) => b[1] - a[1]);
  vocabCountBadge.textContent = `${sortedKeywords.length} content keywords`;

  const topThreshold = sortedKeywords.length > 0 ? sortedKeywords[0][1] * 0.6 : 0;

  sortedKeywords.slice(0, 36).forEach(([word, freq]) => {
    const tag = document.createElement('div');
    tag.className = `keyword-tag ${freq >= topThreshold ? 'high-weight' : ''}`;
    tag.innerHTML = `
      <span class="word">${escapeHtml(word)}</span>
      <span class="freq">${freq}</span>
    `;
    keywordTagsContainer.appendChild(tag);
  });

  // Scroll to results smoothly
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Main Run Action
 */
function runSummarization() {
  const text = inputText.value.trim();
  if (!text) {
    alert('Please enter or load an article or paragraph to summarize.');
    inputText.focus();
    return;
  }

  const lengthMode = parseInt(lengthSlider.value, 10);
  const result = performExtractiveSummarization(text, lengthMode);

  if (result.error) {
    alert(result.error);
    return;
  }

  renderResults(result);
}

/**
 * Copy Summary to Clipboard
 */
async function copySummaryToClipboard() {
  if (!currentSummaryString) return;
  try {
    await navigator.clipboard.writeText(currentSummaryString);
    copyBtnText.textContent = 'Copied!';
    btnCopySummary.style.borderColor = '#10b981';
    setTimeout(() => {
      copyBtnText.textContent = 'Copy';
      btnCopySummary.style.borderColor = '';
    }, 2000);
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = currentSummaryString;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copyBtnText.textContent = 'Copied!';
    setTimeout(() => {
      copyBtnText.textContent = 'Copy';
    }, 2000);
  }
}

/**
 * Toggle Original Highlighting
 */
function handleHighlightToggle() {
  if (toggleHighlights.checked) {
    originalHighlightedOutput.classList.add('highlights-active');
  } else {
    originalHighlightedOutput.classList.remove('highlights-active');
  }
}

/**
 * Tabs Switcher
 */
function handleTabClick(e) {
  const btn = e.currentTarget;
  const targetId = btn.dataset.target;

  tabButtons.forEach(b => b.classList.remove('active'));
  tabPanes.forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  const targetPane = document.getElementById(targetId);
  if (targetPane) targetPane.classList.add('active');
}

/**
 * HTML Escaping helper
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   Initialization & Event Listeners
   ========================================================================== */
function init() {
  inputText.addEventListener('input', updateLiveCounters);
  btnLoadExample.addEventListener('click', loadExample);
  btnClear.addEventListener('click', clearAll);
  btnSummarize.addEventListener('click', runSummarization);
  btnCopySummary.addEventListener('click', copySummaryToClipboard);
  toggleHighlights.addEventListener('change', handleHighlightToggle);

  lengthSlider.addEventListener('input', () => {
    updateSliderUI();
    // If results are already active, automatically re-summarize
    if (resultsSection.style.display !== 'none' && inputText.value.trim()) {
      runSummarization();
    }
  });

  // Ticks click listener
  tickLabels.forEach(tick => {
    tick.addEventListener('click', () => {
      lengthSlider.value = tick.dataset.val;
      updateSliderUI();
      if (resultsSection.style.display !== 'none' && inputText.value.trim()) {
        runSummarization();
      }
    });
  });

  // Tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });

  // Initialize Slider UI & Counters
  updateSliderUI();
  updateLiveCounters();
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
