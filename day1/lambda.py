# from question import num


# students = [
#     {"name": "Vaibhav", "roll": 21},
#     {"name": "Vaibhav", "roll": 20},
#     {"name": "Akash", "roll": 19},
# ]

# We want the sorting to happen in alphabetical order of name
# if 2 students have the same name, then sort using roll num

# students = sorted(students, key=lambda student: (student["name"], -student["roll"]))
# print(students)


numbers = [1, 2, 3, 4, 5, 6]

def get_even_numbers(my_list):
  l = list()
  for num in my_list:
    if num % 2 == 0:
      l.append(num)
  
  return l

print(get_even_numbers(numbers))

even_numbers = list(filter(lambda num: num % 2 == 0, numbers))
# In filter, you return a boolean balue
# If for any element in the list, if the return is true, then it is filtered else not filtered

print(even_numbers)

squared_numbers = list(map(lambda num: num * num, numbers))
print(squared_numbers)

"""
Limitations:
1. Lambdas have only 1 expression
2. Cannot contain statements
3. Cannot have multiple lines
"""

# lambda x:
#   y = x + 1
#   return y

"""
Given a number, double it if more than 10, if greater than 5, add 5, esle do nothing.

If simple -> lambda
Else -> normal function
"""

def transform(num):
  if num > 10:
    return num * 2
  elif num > 5:
    return num + 5
  return num

# Ternary Operator: x == 5 ? x : x + 2 | x if x == 5 else x + 2
transform_lambda = lambda num: num * 2 if num > 10 else num + 5 if num > 5 else num
print(transform_lambda(11))