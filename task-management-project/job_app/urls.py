from django.urls import path, include
from rest_framework.routers import DefaultRouter
from job_app.views import ApplicationViewSet, JobViewSet

# Router is a class that takes care of routing
router = DefaultRouter()

# We register the view sets in the router and the urls are
# then registered by the router using router.urls
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
   path('', include(router.urls)),
]
