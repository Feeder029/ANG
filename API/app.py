from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import subprocess
import qrcode
import csv
import os
import base64
from io import BytesIO
import socket

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Get the local IP address
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='ang_appointmentdb'
    )

# ---------------------- CREATE RECEIPT QR & INPUT DATABASE ---------------------- #

# Insert to Database
def inputinfo(PatID, StatusID, ChosenDate, ChosenTime, QRPath, QRData):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO appointment
        (PatientID, StatusID, APP_ChosenDate, APP_ChosenTime, APP_QR, APP_QRPath)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (PatID, StatusID, ChosenDate, ChosenTime, QRData, QRPath))
        conn.commit()
        
        # Get the last inserted ID
        appointment_id = cursor.lastrowid
        print(f"Appointment successfully inserted with ID: {appointment_id}")
        return appointment_id

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()     

# Generate QR Code
def generate_qr(PatID, ChosenDate, ChosenTime):
    # Create QR code data
    qr_data = f"ChosenDate: {ChosenDate}, Chosen Time: {ChosenTime}"
    qr = qrcode.make(qr_data)
    
    # Save to file system
    qr_directory = "QR_IMAGES"
    os.makedirs(qr_directory, exist_ok=True)
    qr_filename = f"QR_CODE_{ChosenDate.replace('-', '')}_{ChosenTime.replace(':', '').replace(' ', '')}.png"
    qr_path = os.path.join(qr_directory, qr_filename)
    qr.save(qr_path)
    print(f"QR code saved as {qr_path}")
    
    # Also get binary data for database
    buffered = BytesIO()
    qr.save(buffered)
    qr_binary = buffered.getvalue()
    
    return qr_path, qr_binary

# QR Opening Point
@app.route('/update_database_qr', methods=['POST'])
def handle_request():
    data = request.get_json()
    PatID = data.get("PID")
    ChosenDate = data.get("APP_ChosenDate")
    ChosenTime = data.get("APP_ChosenTime")

    if not PatID or not ChosenDate or not ChosenTime:
        return jsonify({"error": "Missing Details"}), 400
    
    qr_filename, qr_binary = generate_qr(PatID, ChosenDate, ChosenTime)
    appointment_id = inputinfo(PatID, 4, ChosenDate, ChosenTime, qr_filename, qr_binary)
    
    # Get the server's IP address and port for QR access
    ip_address = get_ip_address()
    port = 5000
    qr_url = f"http://{ip_address}:{port}/qr_images/{os.path.basename(qr_filename)}"
    
    if appointment_id:
        return jsonify({
            "message": "QR Code Generated", 
            "qr_path": qr_filename,
            "qr_url": qr_url,
            "appointment": {
                "status": "success",
                "message": "Appointment created successfully",
                "id": appointment_id
            }
        })
    else:
        return jsonify({"error": "Failed to create appointment"}), 500

# Route to serve QR code images
@app.route('/qr_images/<filename>')
def serve_qr_image(filename):
    return send_from_directory('QR_IMAGES', filename)

# Root route to check if server is running
@app.route('/')
def index():
    ip = get_ip_address()
    return f"Flask server is running on {ip}:5000"

# ---------------------- RUN THE FLASK SERVER ---------------------- #
if __name__ == "__main__":
    ip_address = get_ip_address()
    print(f"Server running at: http://{ip_address}:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)  # Running on all interfaces