from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import subprocess
import qrcode
import csv
import os
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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
    qrname = f"QR_IMAGES/QR_CODE_{ChosenDate.replace('-', '')}_{ChosenTime.replace(':', '').replace(' ', '')}.png"
    os.makedirs("QR_IMAGES", exist_ok=True)
    qr.save(qrname)
    print(f"QR code saved as {qrname}")
    
    # Also get binary data for database
    buffered = BytesIO()
    qr.save(buffered)
    qr_binary = buffered.getvalue()
    
    return qrname, qr_binary

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
    
    if appointment_id:
        return jsonify({
            "message": "QR Code Generated", 
            "qr_path": qr_filename,
            "appointment": {
                "status": "success",
                "message": "Appointment created successfully",
                "id": appointment_id
            }
        })
    else:
        return jsonify({"error": "Failed to create appointment"}), 500


# ---------------------- RUN THE FLASK SERVER ---------------------- #
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Running on Port 5000