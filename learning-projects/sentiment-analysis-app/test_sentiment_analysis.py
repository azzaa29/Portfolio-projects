import unittest

from sentiment_analysis import sentiment_analyzer

class TestSentimentAnalyzer(unittest.TestCase):
    def test_positive_sentiment(self):
        result = sentiment_analyzer("I love working with Python.")
        self.assertEqual(result["label"], "SENT_POSITIVE")

    def test_negative_sentiment(self):
        result = sentiment_analyzer("I hate working with Python.")
        self.assertEqual(result["label"], "SENT_NEGATIVE")

    def test_neutral_sentiment(self):
        result = sentiment_analyzer("I am neutral about Python.")
        self.assertEqual(result["label"], "SENT_NEUTRAL")

if __name__ == "__main__":
    unittest.main()
