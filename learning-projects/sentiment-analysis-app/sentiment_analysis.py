import json
import requests

def sentiment_analyzer(text_to_analyse: str) -> dict:
    """
    Call a remote sentiment analysis service and return a dict with
    'label' and 'score'.
    """
    url = (
        "https://sn-watson-sentiment-bert.labs.skills.network/"
        "v1/watson.runtime.nlp.v1/NlpService/SentimentPredict"
    )

    payload = {"raw_document": {"text": text_to_analyse}}
    headers = {
        "grpc-metadata-mm-model-id": "sentiment_aggregated-bert-workflow_lang_multi_stock"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        # In the training environment this might return 500 or other errors
        return {"label": None, "score": None}

    formatted_response = json.loads(response.text)

    label = formatted_response["documentSentiment"]["label"]
    score = formatted_response["documentSentiment"]["score"]

    return {"label": label, "score": score}
