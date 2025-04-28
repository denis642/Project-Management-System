
from rest_framework import serializers
from .models import User, Supervisor, StudentLead, StudentProject, ProjectMembers




class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='student')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def validate_username(self, value):
        """Ensure the username is unique."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user




# User Serializer (Optional - if you need basic user data)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        

# Supervisor Profile Serializer
class SupervisorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in response

    class Meta:
        model = Supervisor
        fields = ['user_id', 'user', 'first_name', 'last_name', 'department']

    def create(self, validated_data):
        user = self.context['request'].user


        supervisor, created = Supervisor.objects.update_or_create(
            user=user,
            defaults={
                "first_name": validated_data.get("first_name", ""),
                "last_name": validated_data.get("last_name", ""),
                "department": validated_data.get("department", ""),
            },
        )
        return supervisor
    


#








class ProjectSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in response
    class Meta:
        model = StudentProject
        fields = ['user_id','user', 'title', 'description']

    def create(self, validated_data):
        user = self.context['request'].user

        project, created = StudentProject.objects.update_or_create(
            user=user,
            defaults={
                "title": validated_data.get("title", ""),
                "description": validated_data.get("description", ""),
            },
        )
        return project

class StudentMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in response
    class Meta:
        model = ProjectMembers
        fields = ['user_id', 'user', 'first_name', 'last_name']

    def create(self, validated_data):
        user = self.context['request'].user

        student_member, created = ProjectMembers.objects.update_or_create(
            user=user,
            defaults={
                "first_name": validated_data.get("first_name", ""),
                "last_name": validated_data.get("last_name", ""),
            },
        )
        return student_member





        #  Student Lead Profile Serializer
class StudentLeadSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    supervisor = SupervisorSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = StudentLead
        fields = ['user_id', 'user', 'first_name', 'last_name', 'programme', 'supervisor', 'project']

    def create(self, validated_data):
        user = self.context['request'].user
        supervisor = self.context['supervisor']  # Retrieved from view
        # project = self.context['project']  # Retrieved from view

        # Check if the StudentLead already exists
        student_lead, created = StudentLead.objects.update_or_create(
            user=user,  # Unique constraint ensures there's only one per user
            defaults={
                "supervisor": supervisor,
                "first_name": validated_data.get("first_name", ""),
                "last_name": validated_data.get("last_name", ""),
                "programme": validated_data.get("programme", ""),
            },
        )

        return student_lead