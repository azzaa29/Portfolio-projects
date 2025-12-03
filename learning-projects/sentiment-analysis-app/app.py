"""
Flask app exposing a simple web interface for sentiment analysis.
"""

from flask import Flask, render_template, request

from sentiment_analysis import sentiment_analyzer

app = Flask("Sentiment Analyzer")

@app.route("/sentimentAnalyzer")
def sent_analyzer():
    text_to_analyze = request.args.get("textToAnalyze", "")

    if not text_to_analyze:
        return "Please provide text to analyze."

    response = sentiment_analyzer(text_to_analyze)
    label = response.get("label")
    score = response.get("score")

    if label is None:
        return "Invalid input or service error. Try again."

    # label is e.g. SENT_POSITIVE → prendiamo solo POSITIVE
    label_readable = label.split("_", 1)[1] if "_" in label else label

    return f"The given text has been identified as {label_readable} with a score of {score}."

@app.route("/")
def render_index_page():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
