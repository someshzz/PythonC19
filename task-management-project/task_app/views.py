from rest_framework.decorators import api_view
from rest_framework.response import Response
from task_app.models import Task
from task_app.serializers import TaskSerializer, UserSerializer


@api_view(['POST'])
def add_task(request):
  serializer = TaskSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  serializer.save()
  return Response(serializer.data)


@api_view(['POST'])
def add_user(request):
  # Creating a new object of UserSerializer with data = request.data. UserSerializer 
  # will deserialze on the on basis of mentioned fields
  serializer = UserSerializer(data=request.data)

  # Checks if everything is valid
  serializer.is_valid(raise_exception=True)

  # Calls Users.objects.create() internally
  serializer.save()

  # serializer.data is the created user but deserialized on the basis of what was mentioned.
  return Response(serializer.data) 


# Write an API to read all tasks for a given user_id GET /read_tasks_for_user
