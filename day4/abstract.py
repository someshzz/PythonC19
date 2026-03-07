from abc import ABC, abstractmethod


class Test:

  def test_func(self):
    print("Test Function")


test = Test()
test.test_func()

"""
  I want that anyone who uses Animal class as a parent,
  they must override make_sound function in the child class.
"""
class Animal(ABC):

  def __init__(self):
    super().__init__()

  @abstractmethod
  def make_sound(self):
    print("Animal Sound")
  

class Dog(Animal):
  
  def make_sound(self):
    print("Woof")


class Cat(Animal):
  
  def make_sound(self):
    print("Meow")


dog = Dog()
dog.make_sound()

cat = Cat()
cat.make_sound()