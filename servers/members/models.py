from django.db import models
from userAuthe.models import User, StudentProject
# Create your models here.





class ProjectParticipants(models.Model):
    # project = models.ForeignKey(StudentProject, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    admision_no = models.CharField(max_length=100)
    programme = models.CharField(max_length=100)
    mail = models.CharField(max_length=100, blank=True, null=True)
    

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.project.name})"