"""
Simple command-line chatbot using the facebook/blenderbot-400M-distill model
from Hugging Face Transformers.

"""

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "facebook/blenderbot-400M-distill"

# Load model and tokenizer (download on first run)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

conversation_history = []


def main():
    print("Chatbot ready. Type 'quit' to exit.\n")

    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if not user_input:
            continue

        if user_input.lower() in {"quit", "exit"}:
            print("Goodbye!")
            break

        history_string = "\n".join(conversation_history)

        inputs = tokenizer.encode_plus(
            history_string,
            user_input,
            return_tensors="pt",
            truncation=True
        )

        outputs = model.generate(**inputs, max_length=60)

        response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

        print(response)

        conversation_history.append(user_input)
        conversation_history.append(response)


if __name__ == "__main__":
    main()
