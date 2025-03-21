from django.urls import path, include
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
import debug_toolbar

from user.views import RegisterView, ActivateAccountView

from .routers import Router

router = Router(trailing_slash=False)

router.register(r"auth/register", RegisterView, basename="register")
router.register(
    r"auth/activate/(?P<uid>[0-9A-Za-z_\-]+)/(?P<token>.+)",
    ActivateAccountView,
    basename="activate",
)

api_urlpatterns = [
    path("", include(router.urls)),
]

urlpatterns = [
    path(
        "api/",
        include(api_urlpatterns),
    ),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]  # pragma: no cover

    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )  # pragma: no cover
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )  # pragma: no cover
