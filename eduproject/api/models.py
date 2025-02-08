from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    name = models.CharField(max_length=100)  
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=15) 
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume - {self.name}"


class Message(models.Model):
    sender = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_messages", on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.text[:20]}"
    
    
class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

class Quiz(models.Model):
    question = models.TextField()
    answer = models.TextField()

class Review(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    review_text = models.TextField()
    rating = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

class Reward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    achieved_on = models.DateField()

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_internship = models.BooleanField(default=False)
