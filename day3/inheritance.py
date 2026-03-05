# Parent Child Relationship
# Parent aka Super aka Base
# Child aka Sub aka Derived


class Parent:

    def __init__(self, a: int, b: int):
        self.a = a
        self.b = b

    def add_two_numbers(self):
        return self.a + self.b


class Child(Parent):

    # third_num: int

    def __init__(self, a: int, b: int, c: int):
        #  You must call the constructor of the parent in the first line
        super().__init__(a, b)
        self.c = c

    def add_three_numbers(self):
        return super().add_two_numbers() + self.c

    # Function is getting over-ridden called as Function Overriding
    def add_two_numbers(self):
        return (self.a + self.b) * 2


parent = Parent(5, 6)
child = Child(5, 6, 30)
print(parent.add_two_numbers())
print(child.add_two_numbers())
# print(child.add_three_numbers())
