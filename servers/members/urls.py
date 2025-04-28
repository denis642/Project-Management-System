

from django.urls import path
from . import views


urlpatterns = [
     path("create/", views.add_project_members, name="create_members"),
     path("view/<int:user_id>/", views.ProjectStudentDetailView.as_view(), name="view_members"),


     # operations
    path('view_one_member/<int:member_id>/', views.get_specific_member, name='get_specific_member'),
    path('delete/<int:member_id>/', views.delete_project_member, name='delete_project_member'),
    path('update/<int:member_id>/', views.update_project_member, name='update_project_member'),
]
