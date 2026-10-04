# SmartSummarizer – Text Summarization 📄✨
### College Text & Speech Analysis (TSA) Laboratory — Experiment 04

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Zero Backend](https://img.shields.io/badge/Backend-100%25%20Client--Side-blueviolet?style=for-the-badge)]()
[![No API Key](https://img.shields.io/badge/API%20Key-None%20Required-success?style=for-the-badge)]()

---

## 📌 Executive Summary & Objective

**SmartSummarizer** is a web-based Natural Language Processing application built for the **Text & Speech Analysis (Experiment 04)** academic curriculum. It implements an authentic **statistical extractive text summarization** system that analyzes source documents, extracts salient content words, scores individual sentences based on normalized term frequencies, and selects the most informative sentences while strictly preserving their original sequential order.

> **Theoretical Definition:**  
> *“Text summarization automatically reduces a long document into a shorter version while preserving its important information.”*

---

## 🧠 Extractive vs. Abstractive Summarization

| Feature | Extractive Summarization (This Project) | Abstractive Summarization |
| :--- | :--- | :--- |
| **Mechanism** | Identifies and extracts key sentences directly from the passage | Rephrases and generates novel sentences using LLMs |
| **Factual Integrity** | **100% factual accuracy**; zero hallucination or false context | Vulnerable to stochastic hallucinations |
| **Dependencies** | **Zero external dependencies**; pure client-side JavaScript | Requires large parameter models, GPUs, or API keys |
| **Execution Speed** | Sub-millisecond instantaneous scoring in-browser | High latency (network calls & model inference) |
| **Explainability** | Fully transparent scoring matrix & ranking inspection | Black-box deep neural activations |

---

## ⚙️ The 7-Step Extractive Summarization Pipeline

SmartSummarizer follows a standard, rigorous 7-stage NLP pipeline implemented entirely in native JavaScript:

```
[ Raw Text Input ]
        │
        ▼
1. Sentence Segmentation ───► Regex boundary matching (. ! ?) with abbreviation/decimal shielding
        │
        ▼
2. Word Tokenization    ───► Normalization to lowercase alphabetic tokens (\b[a-z]{2,}\b)
        │
        ▼
3. Stop Word Filtering  ───► Exclusion of non-informative grammatical function words
        │
        ▼
4. Word Frequency Matrix───► Normalized term frequency: W_norm(w) = f(w) / f_max
        │
        ▼
5. Sentence Scoring     ───► Length-normalized summation: Score(S) = (Σ W_norm) / sqrt(WordCount)
        │
        ▼
6. Top-K Selection      ───► Extraction of top K sentences based on slider (Short, Med, Long)
        │
        ▼
7. Order Preservation   ───► Re-sorting selected sentences to their original chronological sequence
        │
        ▼
[ Generated Summary & Analytics ]
```

### 📐 Mathematical Formulation

1. **Normalized Word Frequency:**
   $$\text{W}_{\text{norm}}(w) = \frac{\text{freq}(w)}{\max_{v \in \mathcal{V}} \text{freq}(v)}$$
   *Where $\mathcal{V}$ is the vocabulary of content (non-stop) words in the document.*

2. **Sentence Significance Score:**
   $$\text{Score}(S) = \frac{\sum_{w \in S \cap \mathcal{V}} \text{W}_{\text{norm}}(w)}{\sqrt{|S_{\text{words}}|}}$$
   *The denominator $\sqrt{|S_{\text{words}}|}$ applies dampening length normalization so long, run-on sentences do not dominate the selection unfairly.*

3. **Compression Percentage:**
   $$\text{Compression \%} = \left( 1 - \frac{\text{Words}_{\text{summary}}}{\text{Words}_{\text{original}}} \right) \times 100\%$$

---

## 🌟 Key Application Features

- **Large Interactive Textarea:** Direct pasting or typing of any paragraph or multi-paragraph article with live counters for characters, words, and sentences.
- **Calibrated Length Slider:**
  - 🟢 **Short (~30% retained):** High compression (~55% to 65% reduction) for fast executive overviews.
  - 🔵 **Medium (~50% retained):** Balanced summary retaining the core logical narrative.
  - 🟡 **Long (~70% retained):** Comprehensive digest retaining detailed supporting context.
- **One-Click Actions:**
  - **Load Example:** Pre-loads a clinical NLP paragraph discussing *Artificial Intelligence in Healthcare*.
  - **Summarize Now:** Triggers the pipeline and dynamically updates metrics and visualizations.
  - **Clear:** Wipes the canvas and resets analytics.
  - **Copy to Clipboard:** Seamless one-click copy with instant visual feedback.
- **Dual Visual Results View:**
  - **Generated Summary Card:** Formatted final summary with reading time and retention badges.
  - **Original Text with Interactive Highlights:** Visual breakdown highlighting extracted sentences in green alongside an on/off toggle switch.
- **Lab Diagnostics & Inspection Tabs:**
  - 📊 **Sentence Scoring Inspector Table:** Tabular breakdown of every sentence with word count, raw score, normalized score, global rank, and inclusion status.
  - 🏷️ **Word Frequency Matrix:** Dynamic tag cloud showcasing the top keywords driving sentence weights.
  - 📘 **Laboratory Theory:** Built-in experiment documentation for viva and lab reviews.

---

## 🔬 Sample Demonstration: AI & Healthcare

### Input Document:
> *"Artificial intelligence is rapidly transforming modern healthcare by accelerating diagnostic precision, optimizing treatment pathways, and personalizing patient clinical care. Advanced machine learning models analyze complex medical imaging such as MRI scans, computed tomography, and digital pathology with accuracy that rivals seasoned radiologists. In clinical oncology, predictive neural networks detect malignant cellular mutations months before visible symptomatic onset, empowering physicians to administer proactive therapeutic interventions. Natural language processing algorithms sift through millions of unstructured electronic health records, reducing clinical documentation burdens and allowing medical personnel to devote greater focus to direct patient bedside care. Predictive epidemiological models forecast patient admission spikes, enabling hospital administrators to proactively allocate critical intensive care unit beds and medical resources. Despite these profound breakthroughs, deploying healthcare AI necessitates rigorous ethical governance, algorithmic transparency, and stringent demographic validation to prevent algorithmic bias. Ultimately, artificial intelligence is engineered not to displace human medical practitioners, but to elevate their diagnostic acumen and enrich the delivery of compassionate, evidence-based medicine."*

### Result Metrics:
- **Original Word Count:** 160 words (7 sentences)
- **Summary Word Count (Short):** 69 words (3 sentences)
- **Compression Percentage:** **56.9%**
- **Selected Key Sentences:** Sentences #1, #4, and #5 preserved in chronological order.

---

## 📂 Project Structure

```
TSA4/
├── .gitignore          # Git exclusion rules (ignores .env, logs, OS files)
├── index.html          # Semantic HTML5 layout, accessible controls, and lab headers
├── style.css           # Glassmorphic midnight-slate theme, custom range slider, responsive grid
├── script.js           # Production-ready client-side extractive summarization engine
└── README.md           # Complete academic laboratory documentation & guide
```

---

## 🚀 How to Run Locally

Because this project is built using native web technologies with **zero build steps or external dependencies**, you can run it in seconds:

### Method 1: Direct File Launch
Simply double-click [`index.html`](index.html) or open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Local HTTP Server
Run any lightweight static server:
```bash
# Using Node's npx
npx serve .

# Or using Python (if installed)
python -m http.server 8000
```
Then visit `http://localhost:8000` or `http://localhost:3000` in your web browser.

---

## 🎓 Academic Lab Credits
- **Course:** Text & Speech Analysis (TSA)
- **Experiment:** Experiment 04 — Text Summarization
- **Project Name:** SmartSummarizer – Text Summarization
- **Repository:** [kameshpa7-hash/TSA4](https://github.com/kameshpa7-hash/TSA4.git)

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
