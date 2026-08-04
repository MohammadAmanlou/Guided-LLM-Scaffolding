class Quiz:
    def __init__(
        self,
        id: int,
        name: str,
        startTime: str,
        endTime: str,
        expectedTime: int,
        totalScore: int,
        userScore=None,
        startedAt=None,
        finalized=False
    ):
        self.practice_id = id
        self.name = name
        self.startTime = startTime
        self.endTime = endTime
        self.expectedTime = expectedTime
        self.totalScore = totalScore
        self.userScore = userScore
        self.startedAt = startedAt
        self.finalized = finalized

    def to_dict(self) -> dict:
        return {
            "id": self.practice_id,
            "name": self.name,
            "startTime": self.startTime,
            "endTime": self.endTime,
            "expectedTime": self.expectedTime,
            "totalScore": self.totalScore,
            "userScore": self.userScore,
            "startedAt": self.startedAt,
            "finalized": self.finalized,
        }
