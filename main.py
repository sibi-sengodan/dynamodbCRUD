from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import boto3
from boto3.dynamodb.conditions import Key
from pydantic import BaseModel

app = FastAPI()

# Configure CORS to allow requests from your frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aws_access_key_id = ""
aws_secret_access_key = ""
aws_region = ""

# Initialize the DynamoDB client with the credentials and region
dynamodb = boto3.resource("dynamodb", region_name=aws_region, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
table = dynamodb.Table("mycutomerdetails")

# Define a model for the data
class Student(BaseModel):
    customerid: str
    StudentName: str
    City: str
    Age: int

# API endpoint to get all records
@app.get("/get-all")
async def get_all_students():
    response = table.scan()
    students = [Student(**item) for item in response.get("Items", [])]
    return students

#API endpoint to add a new record
@app.post("/add")
async def add_student(student: Student):
    # Your code to add the student to DynamoDB
    # Make sure to validate and process the data accordingly
    student_data = student.dict()

    # Add the student data to DynamoDB
    try:
        response = table.put_item(Item=student_data)
        return {"message": "Student added successfully"}
    except Exception as e:
        return {"message": f"Failed to add student: {str(e)}"}
    

# API endpoint to edit a record
@app.put("/edit/{customerid}")
async def edit_student(customerid: str, student: Student):
    table.update_item(
        Key={"customerid": customerid},
        UpdateExpression="SET StudentName = :StudentName, City = :City, Age = :Age",
        ExpressionAttributeValues={
            ":StudentName": student.StudentName,
            ":City": student.City,
            ":Age": student.Age,
        },
    )
    return JSONResponse(content={"message": "Student updated successfully"})

# API endpoint to delete a record
@app.delete("/delete/{customerid}")
async def delete_student(customerid: str):
    table.delete_item(Key={"customerid": customerid})
    return JSONResponse(content={"message": "Student deleted successfully"})
