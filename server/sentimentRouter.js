const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const aposToLexForm = require("apos-to-lex-form");
const natural = require("natural");
const SpellingCorrector = require("spelling-corrector");
const SW = require("stopword");

const router = express.Router();

const spellCorrector = new SpellingCorrector();
spellCorrector.loadDictionary();

router.use(bodyParser.json());
router.use(cors());
router.post("/api/nlp", function (req, res, next) {
  const { review } = req.body;
  const lexedReview = aposToLexForm(review);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
  });
  const filteredReview = SW.removeStopwords(tokenizedReview);

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  const analysis = analyzer.getSentiment(filteredReview);

  res.status(200).json({ analysis });
});

module.exports = router;
