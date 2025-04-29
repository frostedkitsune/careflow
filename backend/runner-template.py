import subprocess
import signal
import os
import sys


# Function to handle the SIGINT signal
def signal_handler(sig, frame):
    print("Signal received, terminating subprocess...")
    if process:
        process.terminate()  # Terminate the subprocess
    sys.exit(0)  # Exit the script


# Set up the signal handler
signal.signal(signal.SIGINT, signal_handler)

# Run the command as it is
POSTGRES_URL = ""
process = subprocess.Popen(
    f"env POSTGRES_URL='{POSTGRES_URL}?statement_cache_size=0' fastapi dev app/main.py", shell=True
)

# Wait for the subprocess to complete
process.wait()
