"""
Pydantic 모델 정의
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum


class TaskStatus(str, Enum):
    """크롤링 작업 상태"""
    PENDING = "pending"
    LOGGING_IN = "logging_in"
    SCROLLING = "scrolling"
    EXTRACTING = "extracting"
    CHECKING_FOLLOWERS = "checking_followers"
    COMPLETED = "completed"
    FAILED = "failed"


class CrawlRequest(BaseModel):
    """크롤링 요청"""
    post_url: str = Field(..., description="Instagram 게시물 URL")
    post_author: str = Field(..., description="게시물 작성자 닉네임")
    instagram_id: str = Field(..., description="로그인용 Instagram 아이디")
    instagram_password: str = Field(..., description="로그인용 Instagram 비밀번호")
    check_followers: bool = Field(default=True, description="팔로워 여부 확인")


class CommentData(BaseModel):
    """댓글 데이터"""
    username: str
    content: str
    datetime: Optional[str] = None
    is_reply: bool = False
    is_follower: Optional[bool] = None


class CrawlProgress(BaseModel):
    """크롤링 진행 상태"""
    task_id: str
    status: TaskStatus
    message: str
    progress: int = Field(default=0, ge=0, le=100, description="진행률 (0-100)")
    comments_count: int = 0
    current_step: Optional[str] = None
    error: Optional[str] = None


class CrawlResult(BaseModel):
    """크롤링 결과"""
    task_id: str
    status: TaskStatus
    comments: List[CommentData] = []
    total_comments: int = 0
    follower_count: int = 0
    non_follower_count: int = 0
    error: Optional[str] = None
