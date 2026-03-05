# y = f(x)
# Y depends on x
# y is an dependent variable
# x is an independent variable
# f is the name of function

# I want a logic y is always a square of x;

# y = square(5)
# square(x) = x * x
a = 10
b = 20 
c = 30


# Function
def square(x):
    return x * x


y = square(5)

print(y)


def add_numbers(first_num, second_num, third_num=10):
    return first_num + second_num + third_num


add_numbers_lambda = lambda a, b, c: a + b + c

# lambda arguments: expression
# (a, b, c) -> a + b + c in Java
# (a, b, c) => a + b + c in JS

sum = add_numbers(5, 6, 5)
sum2 = add_numbers(second_num=15, first_num=10)
print(sum, sum2)
print(add_numbers_lambda(-1, -20, -30))
