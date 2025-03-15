import os
import subprocess
import sys
import time

# List of required pip packages
required_packages = ["requests"]

def check_and_install_packages(packages):
    """
    Check if required pip packages are installed, and install them if missing.
    """
    for package in packages:
        try:
            __import__(package)
        except ImportError:
            print(f"'{package}' not found. Installing...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            except subprocess.CalledProcessError as e:
                print(f"Failed to install {package}: {e}")
                sys.exit(1)

def blue_flash():
    """
    Simulate blue flashes in the console.
    """
    for _ in range(3):
        # Set console text color to bright blue
        os.system("color 1F")
        time.sleep(0.2)  # Wait 200ms
        # Reset console text color to default
        os.system("color 07")
        time.sleep(0.2)

def main():
    # Ensure required packages are installed
    check_and_install_packages(["requests"])

    # Import requests after ensuring it's installed
    import requests

    # Define the GitHub file URL
    file_url = "https://raw.githubusercontent.com/DaddyOptis/discord-voice-filter-bypasser/main/index.js"

    # Define Discord's base directory
    discord_base_dir = os.path.join(os.getenv("LOCALAPPDATA"), "Discord")

    # Find the latest version folder
    latest_version = ""
    for folder in os.listdir(discord_base_dir):
        if folder.startswith("app-"):
            latest_version = os.path.join(discord_base_dir, folder)

    if not latest_version:
        print("Discord installation not found. Make sure Discord is installed.")
        sys.exit()

    # Define the target module directory
    target_dir = os.path.join(latest_version, "modules", "discord_voice_filters-1", "discord_voice_filters")

    # Create the target directory if it doesn't exist
    os.makedirs(target_dir, exist_ok=True)

    # Download the file
    try:
        response = requests.get(file_url)
        response.raise_for_status()  # Raise an error for bad status codes
        file_path = os.path.join(target_dir, "index.js")
        with open(file_path, "wb") as file:
            file.write(response.content)
        print(f"File successfully downloaded to {file_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download the file: {e}")

    # Display blue flashes
    blue_flash()

    # Show "Done" message and wait for user input before exiting
    input("Done. Press any key to continue...")
    sys.exit()

if __name__ == "__main__":
    main()
