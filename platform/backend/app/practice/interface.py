from typing import TypedDict, List, Optional

class QuestionInterface(TypedDict, total=False):
    id: int
    imageUrl: str

class PracticeInterface(TypedDict, total=False):
    id: int
    name: str
    startTime: str
    endTime: str
    expectedTime: int
    totalScore: int
    userScore: Optional[int]
    startedAt: Optional[str]
    finalized: Optional[bool]
    questions: List[QuestionInterface]
