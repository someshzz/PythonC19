# MVC vs MVT

MVC and MVT are used when the backend controls the UI of the app

GET 127.0.0.1:8000/about-me -> about-me.html
### MVC - Model View Contoller - .NET / Spring / Node.JS

View = UI

### MVT - Model View Template - Django

Template = UI

********
MVC Contoller = MVT View

<!-- 
1. User
2. Task
 -->

`class User:
    def __init__(self, first_name, last_name, age) {
      ...
    }
`

`class Task:
  def __init__(self, name, desc) {
    ...
  }
`

`class Aadhar:
  def __init__(self, name, dob, a_no, address) {
    ...
  }
`

Create a backend app that takes 2 numbers and returns sum

In code, we have to write

Http Request
POST -> 127.0.0.1:8000/add | a = 4, b = 5 

Http Response = 200 OK | 9

// In View in MVT and Controller in MVC

The file, where Http Requests are received, and processed, and
response is returned, is View in MVT & Controller in MVC
def add_two_numbers(a, b):
  return a + b