from rest_framework import serializers
from job_app.models import Application, Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company', 'location', 'description', 'salary', 'created_at']


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'job', 'full_name', 'email', 'phone', 'cover_letter', 'applied_at']
        read_only_fields = ['applied_at']
