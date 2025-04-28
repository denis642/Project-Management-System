from django.urls import path
from .views import FileListCreateView, FileListView, FileDeleteView, ChapterDetailView

urlpatterns = [
    path('files/', FileListCreateView.as_view(), name='file-list-create'),
    
    path('files_list/<int:user_id>/', FileListView.as_view(), name='file-list'),

    path("files/<int:fileId>/", ChapterDetailView.as_view(), name="chapter-detail"),

    path('files/delete/<int:pk>/', FileDeleteView.as_view(), name='file-delete'),
]