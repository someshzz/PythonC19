from rest_framework.decorators import api_view
from rest_framework.response import Response
from job_app.models import Job
from job_app.serializers import JobSerializer


@api_view(['GET'])
def list_jobs(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)
