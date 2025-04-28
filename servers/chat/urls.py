

from django.urls import path
from .views import get_chat_messages, create_chat_message

urlpatterns = [
    path('chat_messages/<int:student_lead_id>/<int:supervisor_id>/', get_chat_messages, name='get_chat_messages'),
    path('chat_messages/create/', create_chat_message, name='create_chat_message'),
]