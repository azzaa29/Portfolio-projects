"""
Simple script to generate a caption for a local image using the
Salesforce/blip-image-captioning-base model.
"""

from PIL import Image
from transformers import AutoProcessor, BlipForConditionalGeneration

MODEL_NAME = "Salesforce/blip-image-captioning-base"

# Load the pretrained processor and model
processor = AutoProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)


def caption_image_from_path(img_path: str) -> str:
    """
    Generate a caption for an image given its file path.
    """
    image = Image.open(img_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=50)

    caption = processor.decode(outputs[0], skip_special_tokens=True)
    return caption


if __name__ == "__main__":
    # Change this to the path of your image file
    img_path = "IMG_6528.jpeg"

    result = caption_image_from_path(img_path)
    print(result)
