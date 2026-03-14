class User: 

  def __init__(self, id, first_name, last_name, age) -> None:
    self.id = id
    self.first_name = first_name
    self.last_name = last_name
    self.age = age


class Task:
  
  def __init__(self, id, user_id, name, desc) -> None:
    self.id = id
    self.user_id = user_id
    self.name = name
    self.desc = desc