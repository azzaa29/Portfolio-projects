# Sentiment Analysis App

Simple web app that sends text to a remote sentiment analysis service and
displays the label and score in the browser.

Main components:
- `sentiment_analysis.py` – helper function that calls the sentiment API.
- `app.py` – Flask backend exposing a web interface and an HTTP endpoint.
- `templates/index.html` – basic Bootstrap UI.
- `static/mywebscript.js` – small JavaScript function to call the backend.
