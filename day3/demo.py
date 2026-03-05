# Without classes
# Problems:
# 1. The data is global
# 2. Its hard to manage too many orders
# 3. Not Scalable

order_total = 500
order_status = "CREATED"

def cancel_order():
  global order_status
  if order_status == "SHIPPED":
    print("Cannot Cancel")
  else:
    order_status = "CANCELLED"

cancel_order()
print(order_status)

# With classes
# 1. Scabale
# 2. Cleaner architecture
# 3. Easier to test
# 4. Easier for feature addition

class Order: # Will point to a Order table in a DB

  ORDER_COUNT = 0

  def __init__(self, order_id, user_id, restaurant_id, amount, order_count_2=0) -> None:
    self.order_id = order_id
    self.user_id = user_id
    self.restaurant_id = restaurant_id
    self.amount = amount
    self.order_status = "CREATED"
    self.order_count_2 = order_count_2 + 1
    Order.ORDER_COUNT += 1

  def cancel(self):
    if self.order_status == "SHIPPED" or self.order_status == "CANCELLED":
      print("Cannot Cancel")
    else:
      self.order_status = "CANCELLED"

  def test_function():
    print("Class Level Function")

order1 = Order(101, 12, 500)
print(order1.order_count_2)
print(Order.ORDER_COUNT)
#  After 2 days some one will make the status as SHIPPED
# order1.order_status = "SHIPPED"
# Trying to cancel
# order1.cancel()

order2 = Order(101, 12, 500)
print(order2.order_count_2)
print(Order.ORDER_COUNT)
Order.test_function()
