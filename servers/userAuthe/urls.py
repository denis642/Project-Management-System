

from django.urls import path
from . import views
from .views import MyTokenObtainPairView, UserRegisterView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


from django.urls import path
from .views import student_lead_detail, create_project, supervisor_students



urlpatterns = [
    path('', views.getRoutes),

    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('student/profile/', student_lead_detail, name='student-profile'),
    path('student/project/', create_project, name='create-project'),
    path('supervisor/students/', supervisor_students, name='supervisor-students'),


    path('create-profile/supervisor/', views.CreateSupervisorAPIView.as_view(), name='create_supervisor_profile'),
    path('create-profile/studentlead/', views.CreateStudentLeadAPIView.as_view(), name='create_student_profile'),


    path('supervisors/', views.list_supervisors, name='list_supervisors'),
    path('studentleadsupervisor/<int:user_id>/', views.SupervisorStudentDetailView.as_view(), name='list_student_leads'),

    # personal data
    path('onestudentlead/<int:user_id>/', views.StudentLeadDetailView.as_view(), name='one_student_leads'),
    path('onesupervisor/<int:user_id>/', views.SupervisorDetailView.as_view(), name='one_supervisor'),

    # project and members.
    path('create_project/', views.create_project, name='create_project'),

    # personal project for student
    path('view_project/<int:user_id>/', views.ProjectStudentDetailView.as_view(), name='view_project'),

]

