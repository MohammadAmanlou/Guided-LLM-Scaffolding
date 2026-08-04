from typing import TypedDict, List, Optional

class QuizInterface(TypedDict, total=False):
    id: int
    name: str
    startTime: str
    endTime: str
    expectedTime: int
    totalScore: int
    userScore: Optional[int]
    startedAt: Optional[str]
    finalized: Optional[bool]
