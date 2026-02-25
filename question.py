# Given a list of numbers, where numbers can repeat also.
# Return the count of unique numbers

numbers = [10, 10, 10, 10, 1,1,2,2,2,5,5] # 10->4 -> 1

number_frequency = {}

for num in numbers:
  if num in number_frequency:
    number_frequency[num] = number_frequency[num] + 1
  else:
    number_frequency[num] = 1

print(number_frequency)
