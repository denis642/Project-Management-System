from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from supabase import create_client
import os
from .models import File
from .serializers import FileSerializer


class FileListCreateView(generics.ListCreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    parser_classes = (MultiPartParser, FormParser)  # Add parsers for file uploads

    def create(self, request, *args, **kwargs):
        # Extract data from the request
        chapter_name = request.data.get('chapter_name', '')
        name = request.data.get('name', 'Untitled File')  # Default name if not provided
        file = request.data.get('file')

        # Validate required fields
        if not file:
            return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new File instance
        file_instance = File(
            user=request.user,  # Automatically set the user to the authenticated user
            chapter_name=chapter_name,
            name=name,
            file=file
        )
        file_instance.save()

        # Serialize the instance and return the response
        serializer = self.get_serializer(file_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
# class FileListCreateView(generics.ListCreateAPIView):
#     queryset = File.objects.all()
#     serializer_class = FileSerializer
#     parser_classes = (MultiPartParser, FormParser)

#     def create(self, request, *args, **kwargs):
#         # Extract data from the request
#         chapter_name = request.data.get('chapter_name', '')
#         name = request.data.get('name', 'Untitled File')
#         file = request.FILES.get('file')  # Use request.FILES for file uploads

#         # Validate required fields
#         if not file:
#             return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

#         # Initialize Supabase client
#         supabase_url = os.getenv('SUPABASE_URL')
#         supabase_key = os.getenv('SUPABASE_KEY')
#         supabase_bucket_name = os.getenv('SUPABASE_BUCKET_NAME')
#         supabase = create_client(supabase_url, supabase_key)

#         try:
#             # Upload file to Supabase Storage
#             file_data = file.read()
#             file_name = file.name  # Use the original file name or generate a unique name
#             res = supabase.storage.from_(supabase_bucket_name).upload(file_name, file_data, file.content_type)

#             # Get the public URL of the uploaded file
#             file_url = supabase.storage.from_(supabase_bucket_name).get_public_url(file_name)

#             # Create a new File instance with the Supabase file URL
#             file_instance = File(
#                 user=request.user,  # Automatically set the user to the authenticated user
#                 chapter_name=chapter_name,
#                 name=name,
#                 file=file_url  # Save the Supabase file URL instead of the file itself
#             )
#             file_instance.save()

#             # Serialize the instance and return the response
#             serializer = self.get_serializer(file_instance)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def get_queryset(self):
        user_id = self.kwargs['user_id']  # Get user_id from the URL
        return File.objects.filter(user_id=user_id)  # Filter files by user_id


class FileDeleteView(generics.DestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can delete files

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:  # Ensure the user can only delete their own files
            return Response(
                {"error": "You do not have permission to delete this file."},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChapterDetailView(APIView):
    def get(self, request, fileId, *args, **kwargs):
        try:
            chapter = File.objects.get(id=fileId)  # Fetch the chapter by ID
            serializer = FileSerializer(chapter)  # Serialize the data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except File.DoesNotExist:
            return Response(
                {"error": "Chapter not found"}, status=status.HTTP_404_NOT_FOUND
            )