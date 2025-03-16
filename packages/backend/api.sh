# DOCTORS LIST
curl -X GET http://localhost:3000/doctorList \
     -d '{}' | jq

# DOCTOR CREATE
#curl -X POST http://localhost:3000/doctorCreate \
#     -H "Content-Type: application/json" \
#     -d '{"username": "un", "first_name": "fn", "last_name": "ln", "email": "alex2@sh.com" }' | jq


# SLOT CREATE
#curl -X POST http://localhost:3000/slotCreate \
#     -H "Content-Type: application/json" \
#     -d '{"doctor_id": "cm8b756lt0000asfcf15qpctz", "start_time": "2020-01-01T23:00:00.000Z", "end_time": "2020-01-01T24:00:00.000Z", "duration": 60, "repeat": "week" }' | jq

# SLOT BOOK
#curl -X POST http://localhost:3000/appointmentCreate \
#     -H "Content-Type: application/json" \
#     -d '{"slot_id": "cm8b786yn0009asvijdszouzu"}' | jq

# SLOT AVAIL
#curl --get http://localhost:3000/showAllAvailable \
#     --data-urlencode 'input={"doctor_id": "cm8b756lt0000asfcf15qpctz", "doctor_id": "cm8b756lt0000asfcf15qpctz",  "start_time": "2020-01-15T23:00:00.000Z", "end_time": "2020-01-23T00:00:00.000Z"}' | jq

# SLOT BOOKED
#curl --get http://localhost:3000/showAllBooked \
#     --data-urlencode 'input={"doctor_id": "cm8b756lt0000asfcf15qpctz", "doctor_id": "cm8b756lt0000asfcf15qpctz",  "start_time": "2020-01-15T23:00:00.000Z", "end_time": "2020-01-23T00:00:00.000Z"}' | jq
