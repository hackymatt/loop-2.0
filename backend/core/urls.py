from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar

from user.urls import urlpatterns as user_urls

api_urlpatterns = user_urls

# Main URL patterns
urlpatterns = [
    # Include all the API URLs under the /api prefix
    path("api/", include(api_urlpatterns)),
    # Admin route
    path("admin/", admin.site.urls),
]

# Debug toolbar and static/media settings in development mode
if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
