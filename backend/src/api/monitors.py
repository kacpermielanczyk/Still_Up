from typing import Literal

from fastapi import APIRouter, Query, Response, status

from src.api.dependencies import CurrentUser, MonitorServiceDep
from src.schemas.incident import IncidentResponse
from src.schemas.monitor import (
    MonitorCreateRequest,
    MonitorResponse,
    MonitorUpdateRequest,
)
from src.schemas.monitor_check import MonitorCheckResponse
from src.schemas.stats import MonitorStatsResponse

router = APIRouter(
    prefix="/monitors",
    tags=["monitors"],
)


@router.get(
    "",
    response_model=list[MonitorResponse],
)
async def get_monitors(
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    return await service.get_all(current_user)


@router.post(
    "",
    response_model=MonitorResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_monitor(
    data: MonitorCreateRequest,
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    return await service.create(
        data,
        current_user,
    )


@router.get(
    "/{monitor_id}",
    response_model=MonitorResponse,
)
async def get_monitor(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    return await service.get_one(
        monitor_id,
        current_user,
    )


@router.patch(
    "/{monitor_id}",
    response_model=MonitorResponse,
)
async def update_monitor(
    monitor_id: int,
    data: MonitorUpdateRequest,
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    return await service.update(
        monitor_id,
        data,
        current_user,
    )


@router.delete(
    "/{monitor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_monitor(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    await service.delete(
        monitor_id,
        current_user,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


@router.post(
    "/{monitor_id}/check",
    response_model=MonitorCheckResponse,
)
async def check_monitor(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
):
    return await service.check_now(
        monitor_id,
        current_user,
    )


@router.get(
    "/{monitor_id}/checks",
    response_model=list[MonitorCheckResponse],
)
async def get_monitor_checks(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
    limit: int = Query(
        default=50,
        ge=1,
        le=500,
    ),
):
    return await service.get_checks(
        monitor_id,
        current_user,
        limit,
    )


@router.get(
    "/{monitor_id}/incidents",
    response_model=list[IncidentResponse],
)
async def get_monitor_incidents(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
):
    return await service.get_incidents(
        monitor_id,
        current_user,
        limit,
    )


@router.get(
    "/{monitor_id}/stats",
    response_model=MonitorStatsResponse,
)
async def get_monitor_stats(
    monitor_id: int,
    current_user: CurrentUser,
    service: MonitorServiceDep,
    period: Literal["24h", "7d", "30d"] = "24h",
):
    return await service.get_stats(
        monitor_id,
        current_user,
        period,
    )
