from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class Admin(models.Model):
    """
    The Admin model
    """
    id = fields.IntField(primary_key=True)
    #: This is a username
    username = fields.CharField(max_length=20, unique=True)
    name = fields.CharField(max_length=50)
    password_hash = fields.CharField(max_length=128)


    class Meta:
        # table = "admin"
        exclude = ["password_hash"]


class Patient(models.Model):
    """
    The Patient model
    """
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=255)
    email = fields.CharField(max_length=255)
    phone = fields.CharField(max_length=50)
    address = fields.CharField(max_length=255)

    class Meta:
        exclude = []

class Records(models.Model):
    id = fields.IntField(primary_key=True)
    patient_id = fields.IntField()
    doctor_id = fields.IntField()
    notes = fields.TextField()
    record_date = fields.DatetimeField()

    class Meta: 
        exclude = []




Admin_Pydantic = pydantic_model_creator(Admin)
Patient_Pydantic = pydantic_model_creator(Patient)
Records_Pydantic = pydantic_model_creator(Records)
