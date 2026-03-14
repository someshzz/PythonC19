import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

USER_FILE = "/Users/shantanu/B/AirTribe/PythonC19/task-management-project/users.json"
TASK_FILE = "/Users/shantanu/B/AirTribe/PythonC19/task-management-project/tasks.json"

@api_view(['POST'])
def add_task(request):

  # Read from Request
  data = json.loads(request.body)

  # Read current Tasks
  with open(TASK_FILE, "r") as file:
    tasks: list = json.load(file)
  
  # Create New Task
  new_task = {
    "id": data["id"],
    "user_id": data["user_id"],
    "name": data["name"],
    "desc": data["desc"]
  }

  # Append to existing tasks
  tasks.append(new_task) 

  # Save all tasks
  with open(TASK_FILE, "w") as file:
    json.dump(tasks, file, indent=2)

  return Response(new_task)


@api_view(['POST'])
def add_user(request):

  # Read from Request
  data = json.loads(request.body)

  # Read current Tasks
  with open(USER_FILE, "r") as file:
    users: list = json.load(file)
  
  # Create New Task
  new_user = {
    "id": data["id"],
    "first_name": data["first_name"],
    "last_name": data["last_name"],
    "age": data["age"]
  }

  # Append to existing tasks
  users.append(new_user) 

  # Save all tasks
  with open(USER_FILE, "w") as file:
    json.dump(users, file, indent=2)

  return Response(new_user)

# Write an API to read all tasks for a given user_id GET /read_tasks_for_user
