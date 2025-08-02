import os
from PIL import Image
from typing import Union
import pytesseract
import cv2
import numpy as np
from pytesseract import Output
from matplotlib import pyplot as plt

# Function to perform OCR on an image and return the extracted text
def image_to_text(image_input: Union[str, np.ndarray, Image.Image], psm=3, oem=3):
    try:
        # Handle different input types
        if isinstance(image_input, str):
            if not os.path.exists(image_input):
                raise FileNotFoundError(f"Image file not found: {image_input}")
            original_img = cv2.imread(image_input) 
            if original_img is None:
                raise ValueError("Failed to load image from path")
                
        elif isinstance(image_input, np.ndarray):
            if len(image_input.shape) == 3:
                original_img = image_input.copy() 
            else:
                # Grayscale 
                original_img = cv2.cvtColor(image_input, cv2.COLOR_GRAY2BGR)
                
        elif isinstance(image_input, Image.Image):
            img_array = np.array(image_input)
            if len(img_array.shape) == 3:
                original_img = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            else:
                original_img = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")
        
        # Check image dimensions
        height, width = original_img.shape[:2]

        # Check if image is too large and resize if necessary
        max_dimension = 2000
        if max(height, width) > max_dimension:
            scale_factor = max_dimension / max(height, width)
            new_width = int(width * scale_factor)
            new_height = int(height * scale_factor)
            original_img = cv2.resize(original_img, (new_width, new_height), interpolation=cv2.INTER_AREA)
            print(f"Image resized from {width}x{height} to {new_width}x{new_height}")

        # Convert to grayscale
        gray_img = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)

        # Denoising
        denoised_img = cv2.fastNlMeansDenoising(gray_img, None, 10, 7, 21)

        # DPI-based scaling
        target_dpi = 300
        estimated_current_dpi = 72
        dpi_scale = target_dpi / estimated_current_dpi
        
        optimal_width = int(denoised_img.shape[1] * min(dpi_scale, 2.0))
        optimal_height = int(denoised_img.shape[0] * min(dpi_scale, 2.0))
        
        if max(optimal_height, optimal_width) > max_dimension:
            scale = max_dimension / max(optimal_height, optimal_width)
            optimal_width = int(optimal_width * scale)
            optimal_height = int(optimal_height * scale)
        
        resized_img = cv2.resize(denoised_img, (optimal_width, optimal_height), interpolation=cv2.INTER_CUBIC)
        
        # Adaptive threshold
        binary_img = cv2.adaptiveThreshold(resized_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                         cv2.THRESH_BINARY, 41, 4)
        
        # Dilation
        kernel = np.ones((1, 1), np.uint8)
        dilated_img = cv2.dilate(binary_img, kernel, iterations=1)
        
        # OCR
        myconfig = f"--psm {psm} --oem {oem}"
        text = pytesseract.image_to_string(dilated_img, lang='eng', config=myconfig)
        
        return text
        
    except Exception as e:
        print(f"OCR Error: {str(e)}") 
        raise Exception(f"OCR processing failed: {str(e)}")
