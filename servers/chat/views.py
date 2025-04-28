

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChatMessageSerializer
from .models import ChatMessage

@api_view(['POST'])
def create_chat_message(request):
    if request.method == 'POST':
        # Pass the request object in the context
        serializer = ChatMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # Will call the create method
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_chat_messages(request, student_lead_id, supervisor_id):
    try:
        # Filter messages by both student_lead and supervisor IDs
        chat_messages = ChatMessage.objects.filter(
            student_lead=student_lead_id,
            supervisor=supervisor_id
        ).order_by('created_at')

        serializer = ChatMessageSerializer(chat_messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ChatMessage.DoesNotExist:
        return Response({'detail': 'Chat messages not found for this conversation.'}, status=status.HTTP_404_NOT_FOUND)
