# This middleware will just print the information of the request incoming
import time

class RequestLoggingMiddleware:

  def __init__(self, get_response):
    # get_response is a function that is supposed to contain the logic
    # of getting response for this request
    self.get_response = get_response

  def __call__(self, request):

    if (request.path.startswith('/task/add/') == False):
      return self.get_response(request)

    # Before View
    start_time = time.time()
    print(f"Request Started: {request.method} {request.path}")

    # Call View
    response = self.get_response(request)

    # After View
    duration = time.time() - start_time
    print(f"Request ended in {duration:.2f}s")

    return response

