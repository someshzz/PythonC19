from abc import ABC, abstractmethod


class NotificationService(ABC):

  @abstractmethod
  def send_notification(self, title: str, body: str):
    pass

class EmailNotificationService(NotificationService):

  def send_notification(self, title: str, body: str):
    print("Sending Email Notification with Title: " + title + " and body: " + body)

class SMSNotificationService(NotificationService):

  def send_notification(self, title: str, body: str):
    print("Sending SMS Notification with Title: " + title + " and body: " + body)

class PushNotificationService(NotificationService):

  def send_notification(self, title: str, body: str):
    print("Sending Push Notification with Title: " + title + " and body: " + body)