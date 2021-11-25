class ShooterModel {

    static SHOOTER_NUMBER = 8;

    static TREND_UP = 1;
    static TREND_EQUAL = 0;
    static TREND_DOWN = -1;

}

class ShooterResult {

    public readonly name: string;
    public readonly icon: string;
    total: number;
    rank?: number;
    trend: number;
    eliminated: boolean;
    scores: number[];

    constructor(name: string, icon: string) {
        this.name = name;
        this.icon = icon;
        this.total = 0;
        this.trend = ShooterModel.TREND_EQUAL;
        this.eliminated = false;
        this.scores = new Array(24);
    }

    // I/O

    getScoreForAShoot(shootCount: number) {
        return this.scores[shootCount];
    }

    setScoreForAShoot(score: number, shootCount: number) {
        this.scores[shootCount] = score;
    }

    getRank() {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }

    // Functions

    computeTotal() {
        let total = this.scores.reduce((acc, e) => acc + e, 0);
        this.total = Math.round(total * 10) / 10;
    }

}

export { ShooterModel, ShooterResult }