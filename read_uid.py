import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    while True:
        print("Place your card near the reader")
        id, _ = reader.read()
        print(f"Card ID: {id}")
except KeyboardInterrupt:
    GPIO.cleanup()
