import os
import requests
from PIL import Image
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed
import csv

# Directory to save images
SAVE_DIR = 'geo_images'
os.makedirs(SAVE_DIR, exist_ok=True)

# Function to get the static map image
def get_static_map(lat, lon, zoom, size, maptype, api_key):
    url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom={zoom}&size={size}&maptype={maptype}&key={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        return image, None
    except requests.exceptions.RequestException as e:
        return None, str(e)

# Function to save the image and metadata
def save_image_and_metadata(lat, lon, zoom, size, maptype, api_key, save_dir):
    image, error = get_static_map(lat, lon, zoom, size, maptype, api_key)
    if image:
        filename = f"map_{lat}_{lon}.png"
        filepath = os.path.join(save_dir, filename)
        image.save(filepath)
        metadata = {
            'latitude': lat,
            'longitude': lon,
            'zoom': zoom,
            'size': size,
            'maptype': maptype,
            'filename': filename
        }
        return metadata, None
    else:
        return None, error

# Function to download images concurrently
def download_images_concurrently(coords, zoom, size, maptype, api_key, save_dir):
    metadata_list = []
    errors = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [
            executor.submit(save_image_and_metadata, lat, lon, zoom, size, maptype, api_key, save_dir)
            for lat, lon in coords
        ]
        for future in as_completed(futures):
            metadata, error = future.result()
            if metadata:
                metadata_list.append(metadata)
            if error:
                errors.append(error)

    return metadata_list, errors

# Save metadata to CSV
def save_metadata_to_csv(metadata_list, csv_filepath):
    fieldnames = ['latitude', 'longitude', 'zoom', 'size', 'maptype', 'filename']
    with open(csv_filepath, mode='w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for metadata in metadata_list:
            writer.writerow(metadata)

# Main script
if __name__ == "__main__":
    # Example coordinates
    coords = [
        (37.7749, -122.4194),  # San Francisco
        (34.0522, -118.2437),  # Los Angeles
        (40.7128, -74.0060),   # New York
        (51.5074, -0.1278),    # London
        (35.6895, 139.6917)    # Tokyo
    ]
    zoom_level = 15  # Example zoom level
    image_size = "640x640"  # Image size
    map_type = "satellite"  # Map type
    api_key = 'YOUR_API_KEY'  # Replace with your Google Maps API key

    metadata_list, errors = download_images_concurrently(coords, zoom_level, image_size, map_type, api_key, SAVE_DIR)

    # Save metadata to CSV
    save_metadata_to_csv(metadata_list, os.path.join(SAVE_DIR, 'metadata.csv'))

    # Print errors if any
    if errors:
        print("Errors occurred during the download process:")
        for error in errors:
            print(error)
    else:
        print("All images downloaded successfully.")
