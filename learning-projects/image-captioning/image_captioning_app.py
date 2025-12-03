"""
Gradio web app for image captioning using the
Salesforce/blip-image-captioning-base model.
"""

import numpy as np
from PIL import Image
import gradio as gr
from transformers import AutoProcessor, BlipForConditionalGeneration

MODEL_NAME = "Salesforce/blip-image-captioning-base"

# Load the pretrained processor and model once at startup
processor = AutoProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)


def caption_image(input_image: np.ndarray) -> str:
    """
    Generate a caption for an uploaded image.
    """
    if input_image is None:
        return "No image provided."

    raw_image = Image.fromarray(input_image).convert("RGB")

    inputs = processor(raw_image, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=50)

    caption = processor.decode(outputs[0], skip_special_tokens=True)
    return caption


iface = gr.Interface(
    fn=caption_image,
    inputs=gr.Image(label="Upload an image"),
    outputs="text",
    title="Image Captioning",
    description="Generate a caption for an image using a pretrained BLIP model.",
)

if __name__ == "__main__":
    iface.launch(server_name="0.0.0.0", server_port=7860)
