"""
Simple speech-to-text demo using the Whisper tiny English model and Gradio.
"""
import os
os.environ["PATH"] = "/opt/homebrew/bin:" + os.environ.get("PATH", "")

from transformers import pipeline
import gradio as gr

# Load the speech recognition pipeline once at startup
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-tiny.en",
    chunk_length_s=30,
)


def transcribe_audio(audio_file: str) -> str:
    """
    Transcribe an audio file to text using the Whisper model.
    """
    if not audio_file:
        return "No audio file provided."

    result = asr_pipeline(audio_file)
    transcript_text = result.get("text", "").strip()

    if not transcript_text:
        return "No transcription produced."

    return transcript_text


# Define the Gradio interface
audio_input = gr.Audio(sources="upload", type="filepath", label="Upload audio file")
output_text = gr.Textbox(label="Transcription")

iface = gr.Interface(
    fn=transcribe_audio,
    inputs=audio_input,
    outputs=output_text,
    title="Speech-to-Text Demo",
    description="Upload an audio file and get the transcription using Whisper tiny (English).",
)


if __name__ == "__main__":
    iface.launch(server_name="0.0.0.0", server_port=7860)
