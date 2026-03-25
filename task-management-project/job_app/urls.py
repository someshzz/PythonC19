from django.urls import path
from job_app.views import list_jobs

urlpatterns = [
    path('jobs/', list_jobs),
]
