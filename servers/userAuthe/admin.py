from django.contrib import admin
from .models import StudentLead, ProjectMembers, Supervisor, StudentProject
# Register your models here.


admin.site.register(ProjectMembers)
admin.site.register(StudentLead)
admin.site.register(Supervisor)
admin.site.register(StudentProject)

