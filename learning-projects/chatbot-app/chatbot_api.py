"""
Minimal Flask API exposing a chatbot endpoint using the
facebook/blenderbot-400M-distill model from Hugging Face.

Educational example – not intended for production use.
"""

import json
from flask import Flask, request
from flask_cors import CORS
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = Flask(__name__)
CORS(app)

MODEL_NAME = "facebook/blenderbot-400M-distill"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

conversation_history = []


@app.route("/chatbot", methods=["POST"])
def handle_prompt():
    """
    Expects JSON: {"prompt": "Hello"}
    Returns a plain text response from the model.
    """
    raw_data = request.get_data(as_text=True)
    data = json.loads(raw_data)

    user_input = data.get("prompt", "").strip()
    if not user_input:
        return "Empty prompt", 400

    # Keep only the last 10 messages to avoid unbounded growth
    history_string = "\n".join(conversation_history[-10:])

    inputs = tokenizer.encode_plus(
        history_string,
        user_input,
        return_tensors="pt",
        truncation=True
    )

    outputs = model.generate(**inputs, max_length=60)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    conversation_history.append(user_input)
    conversation_history.append(response)

    return response


if __name__ == "__main__":
    app.run(debug=True)
