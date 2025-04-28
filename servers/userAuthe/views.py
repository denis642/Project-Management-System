from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

from .models import StudentProject, StudentLead, ProjectMembers, Supervisor, User
from .serializers import (
    ProjectSerializer,
    StudentLeadSerializer,
    StudentMemberSerializer,
    UserSerializer,
    SupervisorSerializer
)




from django.http import JsonResponse, HttpResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['role'] = user.role  # Add the user's role

        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/user/register',
        '/user/token',
        '/user/token/refresh',
    ]

    return Response(routes)


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registration successful!",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,  # Include role in response
                }
            }, status=201)

        print("Serializer errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=400)






# 🧑‍🎓 StudentLead Detail View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_lead_detail(request):
    """
    Retrieve the details of the logged-in StudentLead (profile).
    """
    if request.user.role != 'student':
        return Response({"error": "You are not authorized to view this page."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = StudentLeadSerializer(request.user)
    return Response(serializer.data)

# 📅 Project Create View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    """
    Allow a StudentLead to create a new project and assign themselves to it.
    """
    if request.user.role != 'student':
        return Response({"error": "You are not authorized to create a project."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(student_lead=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# 👩‍🏫 Supervisor - View All StudentLeads Assigned to Them
@api_view(['GET'])
def supervisor_students(request):

    if request.user.role != 'supervisor':
        return Response({"error": "You are not authorized to view this list."}, status=status.HTTP_403_FORBIDDEN)
    
    student_leads = StudentLead.objects.filter(supervisor__user__username=request.user.username)
    student_leads = StudentLead.objects.all()
    serializer = StudentLeadSerializer(student_leads, many=True)
    return Response(serializer.data)





class CreateSupervisorAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the incoming user data from the request
        supervisor_data = request.data
        
        # Validate and create the user
        supervisor_serializer = UserSerializer(data=supervisor_data)
        if supervisor_serializer.is_valid():
            user = supervisor_serializer.save()

        supervisor_serializer = SupervisorSerializer(
            data=supervisor_data, context={'request': request}
        )

            # Validate and create the supervisor profile
        if supervisor_serializer.is_valid():
            supervisor_serializer.save()
            return Response({"message": "Supervisor created successfully!"}, status=status.HTTP_201_CREATED)
    
    # If the user serializer is invalid, return errors
        return Response(supervisor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateStudentLeadAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Get incoming data for StudentLead profile
        student_lead_data = request.data
        
        # Ensure that the supervisor is passed to the view
        supervisor_id = student_lead_data.get('supervisor')
        if supervisor_id:
            try:
                supervisor = Supervisor.objects.get(user_id=supervisor_id)
            except Supervisor.DoesNotExist:
                return Response({"error": "Supervisor not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Supervisor is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the StudentLeadSerializer with the incoming data and supervisor
        student_lead_serializer = StudentLeadSerializer(
            data=student_lead_data,
            context={'request': request, 'supervisor': supervisor}
        )
        
        if student_lead_serializer.is_valid():
            # Create and save the StudentLead profile
            student_lead_serializer.save()
            return Response({"message": "StudentLead profile created successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(student_lead_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from django.http import JsonResponse
from .models import Supervisor, StudentLead  # Assuming you store users in this model

def list_supervisors(request):
    supervisors = Supervisor.objects.filter().values("user_id", "first_name", "last_name", "department")
    return JsonResponse(list(supervisors), safe=False)





class SupervisorStudentDetailView(RetrieveAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract user_id from URL

        try:
            # Get supervisor by user_id
            supervisor = Supervisor.objects.get(user_id=user_id)
            
            # Get students who selected this supervisor
            students = StudentLead.objects.filter(supervisor=supervisor)
            
            # Serialize supervisor data
            supervisor_data = SupervisorSerializer(supervisor).data
            
            # Create student list with projects
            student_list = []
            for student in students:
                student_projects = StudentProject.objects.filter(user=student.user)
                project_data = ProjectSerializer(student_projects, many=True).data
                
                student_list.append({
                    "user_id": student.user.id,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "programme": student.programme,
                    "projects": project_data
                })
            
            # Combine supervisor details with student list
            response_data = {
                "supervisor": supervisor_data,
                "students": student_list
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Supervisor not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class StudentLeadDetailView(RetrieveAPIView):
    queryset = StudentLead.objects.all()
    serializer_class = StudentLeadSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract user_id from URL

        try:
            # Get student lead by user_id
            student_lead = StudentLead.objects.get(user_id=user_id)
            
            # Get project created by this student
            project = StudentProject.objects.filter(user_id=user_id)
            # Serialize project data
            project_data = ProjectSerializer(project, many=True).data

            # Get members created by this student
            member = ProjectMembers.objects.filter(user_id=user_id)
            # serialize the data
            member_data = StudentMemberSerializer(member, many=True).data


            # Combine student lead details with project list
            response_data = {
                "student_lead": StudentLeadSerializer(student_lead).data,
                "projects": project_data,
                "members": member_data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class SupervisorDetailView(RetrieveAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    lookup_field = "user_id"





# PROJECT AND STUDENT MEMBERS.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, ProjectSerializer, StudentMemberSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    project_data = request.data

    # Validate and create user
    user_serializer = UserSerializer(data=project_data)
    if user_serializer.is_valid():
        user_serializer.save()
    
    # Validate and create project
    project_serializer = ProjectSerializer(data=project_data, context={'request': request})
    if project_serializer.is_valid():
        project_serializer.save()
        return Response({"message": "Project created successfully"}, status=status.HTTP_201_CREATED)
    
    # Return errors if validation fails
    return Response(project_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectStudentDetailView(RetrieveAPIView):
    queryset = StudentLead.objects.all()
    serializer_class = StudentLeadSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract user_id from URL

        try:
            # Get student lead by user_id
            student_lead = StudentLead.objects.get(user_id=user_id)
            
            # Get project created by this student
            project = StudentProject.objects.filter(user_id=user_id)

            # Serialize project data
            project_data = ProjectSerializer(project, many=True).data

            # Combine student lead details with project list
            response_data = {
                "student_lead": StudentLeadSerializer(student_lead).data,
                "projects": project_data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



