from enum import Enum


class ResourceType(str, Enum):
    WEBSITE = "website"
    API = "api"


class MonitorStatus(str, Enum):
    UNKNOWN = "unknown"
    UP = "up"
    DOWN = "down"
    DEGRADED = "degraded"


class CheckStatus(str, Enum):
    SUCCESS = "success"
    FAILURE = "failure"


class IncidentStatus(str, Enum):
    OPEN = "open"
    RESOLVED = "resolved"


class HttpMethod(str, Enum):
    GET = "GET"
    HEAD = "HEAD"