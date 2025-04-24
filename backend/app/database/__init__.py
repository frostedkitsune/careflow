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


    class PydanticMeta:
        # table = "admin"
        exclude = ["password_hash"]


Admin_Pydantic = pydantic_model_creator(Admin)
