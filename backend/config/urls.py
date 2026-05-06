from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.static import serve


def health_check(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('', health_check),
    path('healthz', health_check),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/health/', health_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Railway serves the Django app directly, so expose uploaded media in production too.
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
