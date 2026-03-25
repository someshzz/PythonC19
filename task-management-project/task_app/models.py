from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=100) # Varchar(100)
    last_name = models.CharField(max_length=100) # Varchar(100)
    age = models.IntegerField() # Int

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    desc = models.TextField()

    def __str__(self):
        return self.name
