from rest_framework import serializers
from .models import File
from userAuthe.models import User

class FileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Make user read-only

    class Meta:
        model = File
        fields = ['id', 'user', 'chapter_name', 'name', 'file', 'uploaded_at']  # Include all fields
        read_only_fields = ['uploaded_at']  # Make uploaded_at read-only