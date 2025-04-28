from django.db import models

from userAuthe.models import User
# Create your models here.




class File(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    chapter_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='chapter_uploads_files/')
    # file = models.URLField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name