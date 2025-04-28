




from rest_framework import serializers
from userAuthe.models import User, Supervisor, StudentLead, StudentProject, ProjectMembers
from members.models import ProjectParticipants
from .models import ChatMessage






from rest_framework import serializers
from userAuthe.models import StudentProject, StudentLead, Supervisor
from userAuthe.serializers import UserSerializer
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  

    student_lead = serializers.PrimaryKeyRelatedField(queryset=StudentLead.objects.all())
    supervisor = serializers.PrimaryKeyRelatedField(queryset=Supervisor.objects.all())

    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'student_lead', 'supervisor', 'content', 'created_at', 'modified_at']
        # Added 'user' to fields ^

    def create(self, validated_data):
        user = self.context['request'].user  # Access the user from the request in the context

        chat_message = ChatMessage.objects.create(
            user=user,
            student_lead=validated_data.get('student_lead'),
            supervisor=validated_data.get('supervisor'),
            content=validated_data.get('content'),
        )
        return chat_message
