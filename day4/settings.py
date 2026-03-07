from abc import ABC, abstractmethod
from ast import Dict


class BaseDownstreamService(ABC):

    @abstractmethod
    def ask_settings_data(self) -> dict:
        pass


class TaxDownstreamService(BaseDownstreamService):

    # Add an RBAC check
    def ask_settings_data(self) -> dict:
        # Make an API call to tax service
        # Get the value and return
        return {"taxSettings": {"setting1": True, "setting2": False}}


class ReportingDownstreamService(BaseDownstreamService):

    def ask_settings_data(self) -> dict:
        # Make an API call to reporting service
        # Get the value and return
        return {"reportingSettings": {"setting1": True, "setting2": False}}


class WorkflowDownstreamService(BaseDownstreamService):

    def ask_settings_data(self) -> dict:
        # Make an API call to workflow service
        # Get the value and return
        return {"workflowSettings": {"setting1": True, "setting2": False}}

class ProcessDownstreams:

  def process_downstreams(self, downstream_list: list[BaseDownstreamService]) -> list[Dict]:
    results = list[Dict]()
    # This is synchronous, I made it concurrent using Multithreading
    for downstream in downstream_list:
      results.append(downstream.ask_settings_data())

    return results

p = ProcessDownstreams()
data = p.process_downstreams([TaxDownstreamService(), WorkflowDownstreamService()])
print(data)