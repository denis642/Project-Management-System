

from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('user/', include('userAuthe.urls')),
    # members
    path('members/', include('members.urls')),
    # conversation
    path('chat/', include('chat.urls')),
    # project chapters
    path('chapters/', include('projectChapters.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
