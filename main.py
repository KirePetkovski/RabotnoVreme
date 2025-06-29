import time
import tkinter as tk
from tkinter import PhotoImage
import requests
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()
last_card_id = None
last_card_time = 0


# API URL
API_URL = "http://192.168.100.31/rabotnovremePHP/prisustvo.php"
manual_action_active =False

def auto_polling():
    global polling_job, reset_labels_job, last_card_id, last_card_time

    if manual_action_active:
        polling_job = app.after(200, auto_polling)
        return

    try:
        employee_name, _ = reader.read_no_block()
        current_time = time.time()

        if employee_name:
            if employee_name != last_card_id or (current_time - last_card_time > 5):
                last_card_id = employee_name
                last_card_time = current_time

                name_label.config(text=f"Вработен: {employee_name}")
                send_to_api(employee_name, "Auto")

                if reset_labels_job:
                    app.after_cancel(reset_labels_job)
                reset_labels_job = app.after(3000, reset_labels)
        else:
            last_card_id = None  # card removed

    except Exception as e:
        print(f"Error reading card (Auto): {e}")

    polling_job = app.after(200, auto_polling)

# Function to send data to the API
def send_to_api(employee_name, action_type):
    try:
        payload = {
            "CardID": employee_name,
            "TipAkcija": action_type
        }
        response = requests.post(API_URL, json=payload)

        if response.status_code in (200, 201):
            try:
                print(response.json().get("message", "Success!"))
            except Exception:
                print("Success, but no JSON response from server.")
        else:
            try:
                print(f"Error: {response.json().get('error')}")
            except Exception:
                print(f"Error: {response.text}")  # print raw response if it's not JSON
        
    except Exception as e:
        print(f"Exception occurred: {e}")


# Global variables
polling_job = None
reset_labels_job = None

def reset_labels():
    selection_label.config(text="Селектирано: ---")
    name_label.config(text="Број на карта: ---")

def check_for_card(selected_action):
    global polling_job, reset_labels_job, manual_action_active
    try:
        employee_name, _ = reader.read_no_block()
        if employee_name:
            # Card detected, update name label
            name_label.config(text=f"Број на карта: {employee_name}")

            # Send data to the API
            send_to_api(employee_name, selected_action)

            # Restart the reset timer for 3 seconds from now
            if reset_labels_job:
                app.after_cancel(reset_labels_job)
            reset_labels_job = app.after(3000, reset_labels)

            # Stop polling
            polling_job = None
            manual_action_active = False
            polling_job = app.after(1000, auto_polling)
            return
    except Exception as e:
        print(f"Error reading card: {e}")

    # Schedule another check in 200 ms
    polling_job = app.after(200, lambda: check_for_card(selected_action))

def button_action(button_id):
    global polling_job, reset_labels_job, manual_action_active
    manual_action_active = True
    actions = ["Pauza_Izlez", "Sluzben_Izlez", "Privaten_Izlez", "Vlez"]
    actions_mk=["Пауза Излез", "Слузбен Излез", "Приватен Излез", "Влез"]
    selected_action = actions[button_id - 1]
    selected_action_mk = actions_mk[button_id - 1]

    # Update labels
    selection_label.config(text=f"Селектирано: {selected_action_mk}")
    name_label.config(text="Број на карта: ---")

    # Cancel any existing polling job
    if polling_job:
        app.after_cancel(polling_job)
        polling_job = None

    # Cancel any existing reset labels timer
    if reset_labels_job:
        app.after_cancel(reset_labels_job)
        reset_labels_job = None

    # Start polling for the card
    check_for_card(selected_action)

    # Set the initial reset timer to 5 seconds
    reset_labels_job = app.after(5000, reset_labels)



# Create the main application window
app = tk.Tk()
app.title("Full-Screen App")
app.attributes('-fullscreen', True)


# Define exit behavior (Escape key to exit full screen)
def exit_fullscreen(event):
    app.attributes('-fullscreen', False)


app.bind("<Escape>", exit_fullscreen)


# Function to resize images to a specific dimension
def resize_image(file, width, height):
    img = PhotoImage(file=file)
    img = img.subsample(img.width() // width, img.height() // height)
    return img


# Load and resize icon images
icon1 = resize_image("Pauza.png", 150, 150)
icon2 = resize_image("Sluzben_izlez.png", 150, 150)
icon3 = resize_image("Privaten_izlez.png", 150, 150)
icon4 = resize_image("Drugo.png", 150, 150)

# Create a frame to center the buttons
frame = tk.Frame(app, bg="white")
frame.pack(expand=True, fill=tk.BOTH)

# Configure the grid layout for centering
frame.grid_rowconfigure(0, weight=1)
frame.grid_rowconfigure(1, weight=1)
frame.grid_columnconfigure(0, weight=1)
frame.grid_columnconfigure(1, weight=1)

# Create buttons with icons
btn1 = tk.Button(frame, image=icon1, command=lambda: button_action(1), borderwidth=0)
btn2 = tk.Button(frame, image=icon2, command=lambda: button_action(2), borderwidth=0)
btn3 = tk.Button(frame, image=icon3, command=lambda: button_action(3), borderwidth=0)
btn4 = tk.Button(frame, image=icon4, command=lambda: button_action(4), borderwidth=0)

# Arrange buttons in the grid
btn1.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
btn2.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
btn3.grid(row=1, column=0, padx=20, pady=20, sticky="nsew")
btn4.grid(row=1, column=1, padx=20, pady=20, sticky="nsew")

# Add labels below each button
# lbl1 = tk.Label(frame, text="Пауза излез", bg="white", font=("Arial", 14))
# lbl2 = tk.Label(frame, text="Службен излез", bg="white", font=("Arial", 14))
# lbl3 = tk.Label(frame, text="Приватен излез", bg="white", font=("Arial", 14))
# lbl4 = tk.Label(frame, text="Влез", bg="white", font=("Arial", 14))
#
# lbl1.grid(row=1, column=0, pady=10, sticky="nsew")
# lbl2.grid(row=1, column=1, pady=10, sticky="nsew")
# lbl3.grid(row=3, column=0, pady=10, sticky="nsew")
# lbl4.grid(row=3, column=1, pady=10, sticky="nsew")

# Create labels to display the selected button and person's name
info_frame = tk.Frame(app, bg="white")
info_frame.pack(pady=20)

selection_label = tk.Label(info_frame, text="Селектирано: None", bg="white", font=("Arial", 16))
name_label = tk.Label(info_frame, text="Број на карта: None", bg="white", font=("Arial", 16))

selection_label.pack(pady=5)
name_label.pack(pady=5)

# Start Auto polling on startup
auto_polling()
# Run the application
app.mainloop()
