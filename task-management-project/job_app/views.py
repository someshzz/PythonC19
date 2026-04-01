from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from job_app.models import Application, Job
from job_app.pagination import JobPageNumberPagination
from job_app.serializers import ApplicationSerializer, JobSerializer


# Basic Operations
# 1. Create - POST - /jobs 
# 2. List All - GET - /jobs
# 3. Get One - GET - jobs/{id}
# 4. Update - PUT - jobs/{id}
# 5. Delete - DELETE - jobs/{id}

# ViewSet -- makes our jobs easy when it comes to implement
# these basic functionalities

# class JobViewSet(ViewSet):

#     # We have to just override the functions in ViewSet class
    
#     def list(self, request):
#         jobs = Job.objects.all()
#         serializer = JobSerializer(jobs, many=True)
#         return Response(serializer.data)

#     def create(self, request):
#         serializer = JobSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(data=serializer.data, status=201)

# ModelViewSet is bsasically ViewSet with extra power
# It creates all the basic functionalities with least code
# Less customizable

class JobViewSet(ModelViewSet):

    # Needs 2 things
    # 1. queryset
    # 2. serialzier class

    queryset = Job.objects.all()
    serializer_class = JobSerializer
    # Added for Pagination
    pagination_class = JobPageNumberPagination

    @action(detail=False, methods=["GET"])
    def hello_world(self, request):
        return Response(status=200, data={
            "message": "Hello World"
        })


class ApplicationViewSet(ModelViewSet):
    queryset = Application.objects.select_related('job').all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        job_id = self.request.query_params.get('job')
        if job_id is None:
            return qs
        try:
            return qs.filter(job_id=int(job_id))
        except (TypeError, ValueError):
            return qs.none()

