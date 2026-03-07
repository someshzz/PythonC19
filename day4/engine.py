# Create an Engine class that contains 2 functions.
# 1. move_forward()
# 2. stop()

# Create 3 new classes called ElectricEngine, PetrolEngine, DieselEngine
# Implement these using abstraction.

from abc import ABC, abstractmethod

class Engine(ABC):

  @abstractmethod
  def move_forward(self):
    pass

  @abstractmethod
  def stop(self):
    pass

class PetrolEngine(Engine):

  def move_forward(self):
    print("Petrol Engine moving forward")

  def stop(self):
    print("Petrol engine stopping")

class DieselEngine(Engine):

  def move_forward(self):
    print("Diesel Engine moving forward")

  def stop(self):
    print("Diesel engine stopping")

class ElectricEngine(Engine):

  def move_forward(self):
    print("Electric Engine moving forward")

  def stop(self):
    print("Electric engine stopping")


class Car:

  def __init__(self, engine: Engine):
    self.engine = engine

  def accelerate(self):
    self.engine.move_forward()

  def apply_break(self):
    print("Stopping")
    print("="*80)
    print("Stopped")
    self.engine.stop()


car = Car(ElectricEngine())
car.accelerate()
car.apply_break()

car = Car(PetrolEngine())
car.accelerate()
car.apply_break()

car = Car(DieselEngine())
car.accelerate()
car.apply_break()